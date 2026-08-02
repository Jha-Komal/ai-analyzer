import { AIProvider } from '../lib/ai-provider.interface';
import { createAIProvider } from '../lib/ai-provider.factory';
import { buildReviewAnalysisPrompt } from '../../prompts/review-analysis.prompt';
import {
  buildInsightGenerationPrompt,
  InsightPromptReview,
  InsightPromptReviewAnalysis,
} from '../../prompts/insight-generation.prompt';
import { buildRecommendationPrompt, toRecommendationPromptInput } from '../../prompts/recommendation.prompt';
import { AnalysisResultSchema } from '../validators/analysis.validator';
import {
  InsightGenerationResponseSchema,
  QuestionInsightSchema,
  KeyFindingSchema,
  CrossQuestionPatternSchema,
  BehavioralSegmentSchema,
  ResearchLimitationSchema,
  ValidatedQuestionInsight,
  ValidatedKeyFinding,
  ValidatedCrossQuestionPattern,
  ValidatedBehavioralSegment,
  ValidatedResearchLimitation,
} from '../validators/insight.validator';
import { RecommendationSchema, ValidatedRecommendation } from '../validators/recommendation.validator';
import { AnalysisResult, AggregationStats } from '../types';
import { INSIGHT_QUESTIONS, QUESTIONS_PER_BATCH, InsightQuestion } from '../constants';
import { parseJsonSafe } from '../utils/json-parse';
import { stripUnknownReviewIds } from '../utils/sanitize-review-ids';

const INSIGHT_MAX_TOKENS = 8000;

export interface RunArtifacts {
  batchSummaries: unknown[];
  crossQuestionPatterns: ValidatedCrossQuestionPattern[];
  behavioralSegments: ValidatedBehavioralSegment[];
  researchLimitations: ValidatedResearchLimitation[];
  qualityChecks: Record<string, unknown>;
}

export interface GenerateInsightsResult {
  questionInsights: ValidatedQuestionInsight[];
  runArtifacts: RunArtifacts;
}

interface BatchOutcome {
  questionInsights: ValidatedQuestionInsight[];
  coveredIds: Set<number>;
  batchSummary: unknown;
  crossQuestionPatterns: ValidatedCrossQuestionPattern[];
  behavioralSegments: ValidatedBehavioralSegment[];
  researchLimitations: ValidatedResearchLimitation[];
  reviewIdsStripped: number;
}

function mergeUnique(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

function mergeUniqueNum(a: number[], b: number[]): number[] {
  return [...new Set([...a, ...b])];
}

function dedupeByKey<T>(items: T[], keyFn: (item: T) => string, merge: (a: T, b: T) => T): T[] {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = keyFn(item);
    const existing = map.get(key);
    map.set(key, existing ? merge(existing, item) : item);
  }
  return [...map.values()];
}

function mergeCrossQuestionPattern(
  a: ValidatedCrossQuestionPattern,
  b: ValidatedCrossQuestionPattern
): ValidatedCrossQuestionPattern {
  return {
    ...a,
    related_question_ids: mergeUniqueNum(a.related_question_ids, b.related_question_ids),
    supporting_review_ids: mergeUnique(a.supporting_review_ids, b.supporting_review_ids),
    contradicting_review_ids: mergeUnique(a.contradicting_review_ids, b.contradicting_review_ids),
  };
}

function mergeBehavioralSegment(
  a: ValidatedBehavioralSegment,
  b: ValidatedBehavioralSegment
): ValidatedBehavioralSegment {
  return {
    ...a,
    relevant_question_ids: mergeUniqueNum(a.relevant_question_ids, b.relevant_question_ids),
    supporting_review_ids: mergeUnique(a.supporting_review_ids, b.supporting_review_ids),
    contradicting_review_ids: mergeUnique(a.contradicting_review_ids, b.contradicting_review_ids),
  };
}

function mergeResearchLimitation(
  a: ValidatedResearchLimitation,
  b: ValidatedResearchLimitation
): ValidatedResearchLimitation {
  return {
    ...a,
    affected_questions: mergeUniqueNum(a.affected_questions, b.affected_questions),
  };
}

export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider ?? createAIProvider();
  }

  async analyzeReviews(
    reviews: Array<{ id: string; review: string; source: string }>
  ): Promise<Array<{ id: string; result: AnalysisResult }>> {
    const prompt = buildReviewAnalysisPrompt(reviews);

    let raw: string;
    try {
      raw = await this.provider.complete(prompt);
    } catch (err) {
      throw new Error(`AI provider error: ${String(err)}`);
    }

    let parsed = parseJsonSafe<unknown>(raw);
    if (!parsed) {
      console.warn('[AIService] Failed to parse response, retrying...');
      raw = await this.provider.complete(prompt);
      parsed = parseJsonSafe<unknown>(raw);
    }

    if (!parsed) {
      throw new Error('Failed to parse AI response after retry');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('AI response is not an array');
    }

    const validated: Array<ReturnType<typeof AnalysisResultSchema.parse>> = [];
    for (const item of parsed) {
      const result = AnalysisResultSchema.safeParse(item);
      if (result.success) {
        validated.push(result.data);
      } else {
        console.warn('[AIService] Skipping malformed analysis item:', result.error.message);
      }
    }

    return validated.map((v) => ({
      id: v.id,
      result: {
        sentiment: v.sentiment,
        emotion: v.emotion,
        themes: v.themes,
        painPoints: v.painPoints,
        shoppingHabit: v.shoppingHabit ?? undefined,
        barrier: v.barrier ?? undefined,
        experimentLikelihood: v.experimentLikelihood ?? undefined,
        featureRequests: v.featureRequests,
        category: v.category ?? undefined,
        summary: v.summary,
        confidence: v.confidence,
      },
    }));
  }

  private async runInsightBatch(
    stats: AggregationStats,
    reviews: InsightPromptReview[],
    reviewAnalysis: InsightPromptReviewAnalysis[],
    questions: InsightQuestion[],
    sampleReviewIds: Set<string>
  ): Promise<BatchOutcome> {
    const batchLabel = questions.map((q) => q.id).join(',');
    const empty: BatchOutcome = {
      questionInsights: [],
      coveredIds: new Set(),
      batchSummary: null,
      crossQuestionPatterns: [],
      behavioralSegments: [],
      researchLimitations: [],
      reviewIdsStripped: 0,
    };

    const prompt = buildInsightGenerationPrompt(stats, reviews, reviewAnalysis, questions);

    let raw: string | null = null;
    try {
      raw = await this.provider.complete(prompt, { maxTokens: INSIGHT_MAX_TOKENS });
    } catch (err) {
      console.warn(`[AIService] Insight batch [${batchLabel}] provider error:`, err);
    }
    let parsed = raw ? parseJsonSafe<Record<string, unknown>>(raw) : null;
    if (!parsed) {
      try {
        raw = await this.provider.complete(prompt, { maxTokens: INSIGHT_MAX_TOKENS });
        parsed = raw ? parseJsonSafe<Record<string, unknown>>(raw) : null;
      } catch (err) {
        console.warn(`[AIService] Insight batch [${batchLabel}] retry provider error:`, err);
      }
    }
    if (!parsed) {
      console.warn(`[AIService] Insight batch [${batchLabel}] failed to parse after retry`);
      return empty;
    }

    const root = InsightGenerationResponseSchema.safeParse(parsed);
    if (!root.success) {
      console.warn(`[AIService] Insight batch [${batchLabel}] failed root validation:`, root.error.message);
      return empty;
    }

    const rawItems: unknown[] = Array.isArray(parsed.question_insights) ? parsed.question_insights : [];
    let strippedCount = 0;
    const questionInsights: ValidatedQuestionInsight[] = [];
    const coveredIds = new Set<number>();

    for (const item of rawItems) {
      const qiResult = QuestionInsightSchema.safeParse(item);
      if (!qiResult.success) {
        console.warn(`[AIService] Skipping malformed question_insight in batch [${batchLabel}]:`, qiResult.error.message);
        continue;
      }
      const qi = qiResult.data;

      const rawFindings: unknown[] = Array.isArray(qi.key_findings) ? qi.key_findings : [];
      const findings: ValidatedKeyFinding[] = [];
      for (const f of rawFindings) {
        const fResult = KeyFindingSchema.safeParse(f);
        if (!fResult.success) {
          console.warn(
            `[AIService] Skipping malformed key_finding on question ${qi.question_id}:`,
            fResult.error.message
          );
          continue;
        }
        const finding = fResult.data;
        const supp = stripUnknownReviewIds(finding.supporting_review_ids, sampleReviewIds);
        const contra = stripUnknownReviewIds(finding.contradicting_review_ids, sampleReviewIds);
        strippedCount += supp.strippedCount + contra.strippedCount;
        finding.supporting_review_ids = supp.kept;
        finding.contradicting_review_ids = contra.kept;
        const beforeQualCount = finding.qualitative_evidence.length;
        finding.qualitative_evidence = finding.qualitative_evidence.filter((qe) => sampleReviewIds.has(qe.review_id));
        strippedCount += beforeQualCount - finding.qualitative_evidence.length;
        findings.push(finding);
      }

      const allIds = stripUnknownReviewIds(qi.all_supporting_review_ids, sampleReviewIds);
      strippedCount += allIds.strippedCount;

      const fullQi: ValidatedQuestionInsight = {
        ...qi,
        key_findings: findings,
        all_supporting_review_ids: allIds.kept,
      };
      questionInsights.push(fullQi);
      coveredIds.add(qi.question_id);
    }

    const crossQuestionPatterns = (Array.isArray(root.data.cross_question_patterns) ? root.data.cross_question_patterns : [])
      .map((p) => CrossQuestionPatternSchema.safeParse(p))
      .filter((r): r is { success: true; data: ValidatedCrossQuestionPattern } => r.success)
      .map((r) => r.data);

    const behavioralSegments = (Array.isArray(root.data.behavioral_segments) ? root.data.behavioral_segments : [])
      .map((s) => BehavioralSegmentSchema.safeParse(s))
      .filter((r): r is { success: true; data: ValidatedBehavioralSegment } => r.success)
      .map((r) => r.data);

    const researchLimitations = (Array.isArray(root.data.research_limitations) ? root.data.research_limitations : [])
      .map((l) => ResearchLimitationSchema.safeParse(l))
      .filter((r): r is { success: true; data: ValidatedResearchLimitation } => r.success)
      .map((r) => r.data);

    return {
      questionInsights,
      coveredIds,
      batchSummary: root.data.batch_summary ?? null,
      crossQuestionPatterns,
      behavioralSegments,
      researchLimitations,
      reviewIdsStripped: strippedCount,
    };
  }

  async generateInsights(
    stats: AggregationStats,
    reviews: InsightPromptReview[],
    reviewAnalysis: InsightPromptReviewAnalysis[]
  ): Promise<GenerateInsightsResult> {
    const sampleReviewIds = new Set(reviews.map((r) => r.id));

    const allQuestionInsights: ValidatedQuestionInsight[] = [];
    const coveredIds = new Set<number>();
    const batchSummaries: unknown[] = [];
    let crossQuestionPatterns: ValidatedCrossQuestionPattern[] = [];
    let behavioralSegments: ValidatedBehavioralSegment[] = [];
    let researchLimitations: ValidatedResearchLimitation[] = [];
    let totalStripped = 0;

    const absorb = (outcome: BatchOutcome) => {
      allQuestionInsights.push(...outcome.questionInsights);
      for (const id of outcome.coveredIds) coveredIds.add(id);
      if (outcome.batchSummary) batchSummaries.push(outcome.batchSummary);
      crossQuestionPatterns.push(...outcome.crossQuestionPatterns);
      behavioralSegments.push(...outcome.behavioralSegments);
      researchLimitations.push(...outcome.researchLimitations);
      totalStripped += outcome.reviewIdsStripped;
    };

    for (let i = 0; i < INSIGHT_QUESTIONS.length; i += QUESTIONS_PER_BATCH) {
      const batchQuestions = INSIGHT_QUESTIONS.slice(i, i + QUESTIONS_PER_BATCH);
      const outcome = await this.runInsightBatch(stats, reviews, reviewAnalysis, batchQuestions, sampleReviewIds);
      absorb(outcome);

      const missing = batchQuestions.filter((q) => !coveredIds.has(q.id));
      if (missing.length > 0 && batchQuestions.length > 1) {
        for (const q of missing) {
          const subOutcome = await this.runInsightBatch(stats, reviews, reviewAnalysis, [q], sampleReviewIds);
          absorb(subOutcome);
        }
      }
    }

    if (allQuestionInsights.length === 0) {
      throw new Error('All insight batches failed to generate');
    }

    const stillMissing = INSIGHT_QUESTIONS.filter((q) => !coveredIds.has(q.id));
    if (stillMissing.length > 0) {
      console.warn(
        `[AIService] ${stillMissing.length} question(s) failed even after per-question fallback: ${stillMissing
          .map((q) => q.id)
          .join(', ')}`
      );
    }
    if (totalStripped > 0) {
      console.warn(`[AIService] Stripped ${totalStripped} unknown/hallucinated review id reference(s) from insight output`);
    }

    crossQuestionPatterns = dedupeByKey(
      crossQuestionPatterns,
      (p) => p.pattern.trim().toLowerCase(),
      mergeCrossQuestionPattern
    );
    behavioralSegments = dedupeByKey(
      behavioralSegments,
      (s) => s.segment_name.trim().toLowerCase(),
      mergeBehavioralSegment
    );
    researchLimitations = dedupeByKey(
      researchLimitations,
      (l) => l.limitation.trim().toLowerCase(),
      mergeResearchLimitation
    );

    const qualityChecks: Record<string, unknown> = {
      all_eight_questions_answered: coveredIds.size === INSIGHT_QUESTIONS.length,
      questions_covered: [...coveredIds].sort((a, b) => a - b),
      questions_missing: stillMissing.map((q) => q.id),
      all_review_ids_traceable: totalStripped === 0,
      review_ids_stripped_count: totalStripped,
    };

    return {
      questionInsights: allQuestionInsights,
      runArtifacts: { batchSummaries, crossQuestionPatterns, behavioralSegments, researchLimitations, qualityChecks },
    };
  }

  async generateRecommendations(
    stats: AggregationStats,
    questionInsights: ValidatedQuestionInsight[]
  ): Promise<ValidatedRecommendation[]> {
    const trimmed = toRecommendationPromptInput(questionInsights);
    const prompt = buildRecommendationPrompt(stats, trimmed);

    let raw: string;
    try {
      raw = await this.provider.complete(prompt);
    } catch (err) {
      throw new Error(`AI provider error during recommendation generation: ${String(err)}`);
    }

    let parsed = parseJsonSafe<unknown>(raw);
    if (!parsed) {
      raw = await this.provider.complete(prompt);
      parsed = parseJsonSafe<unknown>(raw);
    }

    if (!parsed) {
      throw new Error('Failed to parse recommendation response after retry');
    }

    const arrCandidate = Array.isArray(parsed) ? parsed : (parsed as Record<string, unknown>).recommendations ?? parsed;
    const rawArr: unknown[] = Array.isArray(arrCandidate) ? arrCandidate : [];

    const validReviewIds = new Set(questionInsights.flatMap((qi) => qi.all_supporting_review_ids));
    const validQuestionIds = new Set(questionInsights.map((qi) => qi.question_id));

    const validated: ValidatedRecommendation[] = [];
    for (const item of rawArr) {
      const result = RecommendationSchema.safeParse(item);
      if (!result.success) {
        console.warn('[AIService] Skipping malformed recommendation:', result.error.message);
        continue;
      }
      const rec = result.data;
      const { kept: keptReviewIds, strippedCount } = stripUnknownReviewIds(rec.supporting_review_ids, validReviewIds);
      if (strippedCount > 0) {
        console.warn(`[AIService] Stripped ${strippedCount} unknown review id(s) from a recommendation`);
      }
      rec.supporting_review_ids = keptReviewIds;
      rec.based_on_question_ids = rec.based_on_question_ids.filter((id) => validQuestionIds.has(id));
      rec.supporting_finding_refs = rec.supporting_finding_refs.filter((ref) => validQuestionIds.has(ref.question_id));
      validated.push(rec);
    }

    if (validated.length === 0) {
      throw new Error('All recommendation items failed validation');
    }

    return validated;
  }
}

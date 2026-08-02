import { prisma } from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import {
  ValidatedQuestionInsight,
  ValidatedCrossQuestionPattern,
  ValidatedBehavioralSegment,
  ValidatedResearchLimitation,
} from '../validators/insight.validator';

export interface CreateRunInput {
  sampleSize: number;
  totalReviewsConsidered: number;
  batchSummaries: unknown[];
  crossQuestionPatterns: ValidatedCrossQuestionPattern[];
  behavioralSegments: ValidatedBehavioralSegment[];
  researchLimitations: ValidatedResearchLimitation[];
  qualityChecks: Record<string, unknown>;
  questionInsights: ValidatedQuestionInsight[];
}

export class InsightRepository {
  async createRun(input: CreateRunInput): Promise<void> {
    // FK order: child rows first, then the run they belong to.
    await prisma.insight.deleteMany();
    await prisma.insightRun.deleteMany();

    await prisma.insightRun.create({
      data: {
        id: uuidv4(),
        sampleSize: input.sampleSize,
        totalReviewsConsidered: input.totalReviewsConsidered,
        batchSummaries: JSON.stringify(input.batchSummaries),
        crossQuestionPatterns: JSON.stringify(input.crossQuestionPatterns),
        behavioralSegments: JSON.stringify(input.behavioralSegments),
        researchLimitations: JSON.stringify(input.researchLimitations),
        qualityChecks: JSON.stringify(input.qualityChecks),
        insights: {
          create: input.questionInsights.map((qi) => ({
            id: uuidv4(),
            questionId: qi.question_id,
            question: qi.question,
            answerStatus: qi.answer_status,
            directAnswer: qi.direct_answer,
            categoryExpansionConnection: JSON.stringify(qi.category_expansion_connection),
            keyFindings: JSON.stringify(qi.key_findings),
            counterEvidence: JSON.stringify(qi.counter_evidence),
            generalPlatformIssuesExcluded: JSON.stringify(qi.general_platform_issues_excluded),
            categoryEligibilityConsiderations: JSON.stringify(qi.category_eligibility_considerations),
            evidenceGaps: JSON.stringify(qi.evidence_gaps),
            allSupportingReviewIds: JSON.stringify(qi.all_supporting_review_ids),
            evidenceStrengthScore: qi.question_evidence_strength.evidence_strength_score,
            evidenceStrengthBand: qi.question_evidence_strength.evidence_strength_band,
            evidenceStrengthDetail: JSON.stringify(qi.question_evidence_strength),
            primaryCategoryExpansionRelevance: qi.category_expansion_connection.relevance,
          })),
        },
      },
    });
  }

  async findLatestRun() {
    return prisma.insightRun.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { insights: { orderBy: { questionId: 'asc' } } },
    });
  }

  async deleteAll(): Promise<void> {
    await prisma.insight.deleteMany();
    await prisma.insightRun.deleteMany();
  }
}

import { z } from 'zod';
import { AIProvider } from '../lib/ai-provider.interface';
import { createAIProvider } from '../lib/ai-provider.factory';
import { buildReviewAnalysisPrompt } from '../../prompts/review-analysis.prompt';
import {
  buildInsightGenerationPrompt,
  InsightPromptReview,
  InsightPromptReviewAnalysis,
} from '../../prompts/insight-generation.prompt';
import { buildRecommendationPrompt } from '../../prompts/recommendation.prompt';
import { AnalysisResultSchema } from '../validators/analysis.validator';
import { InsightGenerationResponseSchema } from '../validators/insight.validator';
import { RecommendationArraySchema } from '../validators/recommendation.validator';
import { AnalysisResult, AggregationStats } from '../types';
import { INSIGHT_QUESTIONS } from '../constants';
import { parseJsonSafe } from '../utils/json-parse';

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

    // Parse and validate
    let parsed = parseJsonSafe<unknown>(raw);
    if (!parsed) {
      // Retry once
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

    const validated: z.infer<typeof AnalysisResultSchema>[] = [];
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

  async generateInsights(
    stats: AggregationStats,
    reviews: InsightPromptReview[],
    reviewAnalysis: InsightPromptReviewAnalysis[]
  ): Promise<
    Array<{
      question: string;
      answer: string;
      confidence: number;
      supportingReviewIds: string[];
    }>
  > {
    const QUESTIONS_PER_BATCH = 2;
    const allInsights: Array<{ question: string; answer: string; confidence: number; supportingReviewIds: string[] }> = [];

    for (let i = 0; i < INSIGHT_QUESTIONS.length; i += QUESTIONS_PER_BATCH) {
      const batchQuestions = INSIGHT_QUESTIONS.slice(i, i + QUESTIONS_PER_BATCH);
      const batchNum = Math.floor(i / QUESTIONS_PER_BATCH) + 1;
      const prompt = buildInsightGenerationPrompt(stats, reviews, reviewAnalysis, batchQuestions);

      let raw: string | null = null;
      try {
        raw = await this.provider.complete(prompt);
      } catch (err) {
        console.warn(`[AIService] Insight batch ${batchNum} provider error:`, err);
        continue;
      }

      let parsed = parseJsonSafe<unknown>(raw);
      if (!parsed) {
        try {
          raw = await this.provider.complete(prompt);
          parsed = parseJsonSafe<unknown>(raw);
        } catch {
          // ignore retry error
        }
      }

      if (!parsed) {
        console.warn(`[AIService] Insight batch ${batchNum} failed to parse, skipping`);
        continue;
      }

      try {
        const validated = InsightGenerationResponseSchema.parse(parsed);
        for (const qi of validated.question_insights) {
          const findingLines = [...qi.key_findings]
            .sort((a, b) => a.rank - b.rank)
            .map((f) => `• ${f.finding}: ${f.explanation}`)
            .join('\n');

          allInsights.push({
            question: qi.question,
            answer: findingLines ? `${qi.direct_answer}\n\n${findingLines}` : qi.direct_answer,
            confidence: qi.confidence_score,
            supportingReviewIds: [...new Set(qi.supporting_review_ids)],
          });
        }
      } catch (err) {
        console.warn(`[AIService] Insight batch ${batchNum} validation failed:`, err);
      }
    }

    if (allInsights.length === 0) {
      throw new Error('All insight batches failed to generate');
    }

    return allInsights;
  }

  async generateRecommendations(
    stats: AggregationStats,
    insights: Array<{ question: string; answer: string }>
  ): Promise<
    Array<{
      priority: string;
      title: string;
      description: string;
    }>
  > {
    const prompt = buildRecommendationPrompt(stats, insights);

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

    // Model returns { recommendations: [...] } due to json_object response format
    const arr =
      Array.isArray(parsed)
        ? parsed
        : (parsed as Record<string, unknown>).recommendations ?? parsed;

    const validated = RecommendationArraySchema.parse(arr);
    return validated;
  }
}

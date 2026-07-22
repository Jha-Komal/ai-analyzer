import { AIProvider } from '../lib/ai-provider.interface';
import { createAIProvider } from '../lib/ai-provider.factory';
import { buildReviewAnalysisPrompt } from '../../prompts/review-analysis.prompt';
import { buildInsightGenerationPrompt } from '../../prompts/insight-generation.prompt';
import { buildRecommendationPrompt } from '../../prompts/recommendation.prompt';
import { AnalysisResultArraySchema } from '../validators/analysis.validator';
import { InsightArraySchema } from '../validators/insight.validator';
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
    let parsed = parseJsonSafe<unknown[]>(raw);
    if (!parsed) {
      // Retry once
      console.warn('[AIService] Failed to parse response, retrying...');
      raw = await this.provider.complete(prompt);
      parsed = parseJsonSafe<unknown[]>(raw);
    }

    if (!parsed) {
      throw new Error('Failed to parse AI response after retry');
    }

    const validated = AnalysisResultArraySchema.parse(parsed);

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
        summary: v.summary,
        confidence: v.confidence,
      },
    }));
  }

  async generateInsights(
    stats: AggregationStats,
    representativeReviews: Array<{ id: string; review: string; sentiment: string }>
  ): Promise<
    Array<{
      question: string;
      answer: string;
      confidence: number;
      supportingReviewIds: string[];
    }>
  > {
    const prompt = buildInsightGenerationPrompt(stats, representativeReviews, INSIGHT_QUESTIONS);

    let raw: string;
    try {
      raw = await this.provider.complete(prompt);
    } catch (err) {
      throw new Error(`AI provider error during insight generation: ${String(err)}`);
    }

    let parsed = parseJsonSafe<unknown[]>(raw);
    if (!parsed) {
      raw = await this.provider.complete(prompt);
      parsed = parseJsonSafe<unknown[]>(raw);
    }

    if (!parsed) {
      throw new Error('Failed to parse insight response after retry');
    }

    const validated = InsightArraySchema.parse(parsed);
    return validated;
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

    let parsed = parseJsonSafe<unknown[]>(raw);
    if (!parsed) {
      raw = await this.provider.complete(prompt);
      parsed = parseJsonSafe<unknown[]>(raw);
    }

    if (!parsed) {
      throw new Error('Failed to parse recommendation response after retry');
    }

    const validated = RecommendationArraySchema.parse(parsed);
    return validated;
  }
}

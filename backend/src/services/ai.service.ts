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

  async suggestCartComplement(cartItems: Array<{ name: string; category: string; weight: string }>): Promise<{
    name: string;
    price: number;
    emoji: string;
    category: string;
    weight: string;
    reason: string;
  }> {
    const itemList = cartItems.map(i => `- ${i.name} (${i.category}, ${i.weight})`).join('\n');

    const cartCategories = [...new Set(cartItems.map(i => i.category))];

    const prompt = `You are a smart grocery shopping assistant for an Indian quick-commerce app (like Blinkit).

A customer has added these items to their cart:
${itemList}

Categories already in cart (DO NOT suggest anything from these): ${cartCategories.join(', ')}

Suggest exactly ONE complementary product that:
1. Is from a category NOT in the list above — this is mandatory
2. Naturally pairs with what they bought (e.g., coke → tumbler/bottle, pasta → strainer, shampoo → microfiber towel, raw chicken → cutting board or marination box)
3. Is practical and budget-friendly — price must be between ₹49 and ₹199
4. Is a real, commonly available Indian product

Respond with ONLY this JSON object (no array, no wrapper):
{
  "name": "<product name, concise, max 5 words>",
  "price": <integer between 49 and 199>,
  "emoji": "<single most relevant emoji>",
  "category": "<category name>",
  "weight": "<quantity or size, e.g. '1 pc', '500 ml', '2 pcs'>",
  "reason": "<one punchy sentence explaining why this pairs perfectly — max 12 words>"
}`;

    let raw: string;
    try {
      raw = await this.provider.complete(prompt);
    } catch (err) {
      throw new Error(`AI provider error: ${String(err)}`);
    }

    const parsed = parseJsonSafe<unknown>(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Failed to parse cart suggestion response');
    }

    const p = parsed as Record<string, unknown>;
    return {
      name:     String(p.name     ?? 'Reusable Bottle'),
      price:    Number(p.price    ?? 99),
      emoji:    String(p.emoji    ?? '🫙'),
      category: String(p.category ?? 'Kitchenware'),
      weight:   String(p.weight   ?? '1 pc'),
      reason:   String(p.reason   ?? 'Perfect companion for your order'),
    };
  }

  async buildAiCart(
    prompt: string,
    budget: number,
    products: Array<{ id: string; name: string; price: number; category: string }>
  ): Promise<{ items: Array<{ id: string; quantity: number }> }> {
    const productList = products
      .map(p => `${p.id}: ${p.name} (${p.category}) ₹${p.price}`)
      .join('\n');

    const aiPrompt = `You are a smart shopping assistant for Blinkit (Indian quick-commerce app).

Customer request: "${prompt}"
Budget: ₹${budget} maximum

Available products (format: id: name (category) ₹price):
${productList}

Build the BEST cart fulfilling the request. Rules:
1. Total price must NOT exceed ₹${budget}
2. Pick 4-8 items from relevant categories for the request
3. Use reasonable quantities (1-2 each)
4. Only use IDs from the list above — never invent IDs
5. Diverse categories make a better cart

Return ONLY this exact JSON (no markdown, no explanation):
{"items":[{"id":"...","quantity":N},...]}`;

    let raw: string;
    try {
      raw = await this.provider.complete(aiPrompt);
    } catch (err) {
      throw new Error(`AI provider error: ${String(err)}`);
    }

    const parsed = parseJsonSafe<unknown>(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Failed to parse ai-cart response');
    }

    const p = parsed as Record<string, unknown>;
    const rawItems = Array.isArray(p.items) ? p.items : [];

    const validIds = new Set(products.map(pr => pr.id));
    const items = (rawItems as unknown[])
      .filter((item): item is { id: string; quantity: number } =>
        typeof item === 'object' && item !== null &&
        typeof (item as Record<string, unknown>).id === 'string' &&
        typeof (item as Record<string, unknown>).quantity === 'number' &&
        validIds.has((item as Record<string, unknown>).id as string)
      )
      .map(item => ({ id: item.id, quantity: Math.max(1, Math.min(5, Math.round(item.quantity))) }));

    return { items };
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

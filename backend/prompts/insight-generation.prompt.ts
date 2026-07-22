import { AggregationStats } from '../src/types';

export function buildInsightGenerationPrompt(
  stats: AggregationStats,
  representativeReviews: Array<{ id: string; review: string; sentiment: string }>,
  questions: string[]
): string {
  return `You are a senior product analyst. Based on the following review statistics and sample reviews, answer each question with deep insight.

AGGREGATION STATISTICS:
${JSON.stringify(stats, null, 2)}

REPRESENTATIVE REVIEWS (sample):
${JSON.stringify(representativeReviews, null, 2)}

QUESTIONS TO ANSWER:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

For each question, provide:
- answer: detailed, actionable answer based on the data
- confidence: how confident you are (0.0 to 1.0)
- supportingReviewIds: array of review IDs from the sample that support this answer

Return ONLY a valid JSON array:
[
  {
    "question": "<question text>",
    "answer": "<detailed answer>",
    "confidence": 0.85,
    "supportingReviewIds": ["<id1>", "<id2>"]
  }
]`;
}

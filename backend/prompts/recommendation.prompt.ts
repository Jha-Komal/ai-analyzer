import { AggregationStats } from '../src/types';

export function buildRecommendationPrompt(
  stats: AggregationStats,
  insights: Array<{ question: string; answer: string }>
): string {
  return `You are a product strategy consultant. Based on user review analysis and insights, generate actionable product recommendations.

REVIEW STATISTICS:
${JSON.stringify(stats, null, 2)}

KEY INSIGHTS:
${JSON.stringify(insights, null, 2)}

Generate recommendations across 4 priority tiers:
- quick_win: Easy to implement, high impact, low effort (1-2 weeks)
- medium: Moderate effort, meaningful impact (1-3 months)
- high: Significant effort, high strategic value (3-6 months)
- long_term: Major initiatives, transformative impact (6+ months)

Return ONLY valid JSON in this exact shape:
{
  "recommendations": [
    {
      "priority": "quick_win|medium|high|long_term",
      "title": "<short title>",
      "description": "<detailed description of what to do and why>"
    }
  ]
}

Generate at least 2 recommendations per priority tier (8 total minimum).`;
}

import { AggregationStats } from '../src/types';
import { ValidatedQuestionInsight } from '../src/validators/insight.validator';

export interface RecommendationInputFinding {
  rank: number;
  finding: string;
  category_expansion_relevance: string;
  frequency: string;
  severity: string;
  product_implication: string;
  supporting_review_ids: string[];
  evidence_strength_band: string;
}

export interface RecommendationInputInsight {
  question_id: number;
  question: string;
  answer_status: string;
  direct_answer: string;
  category_expansion_relevance: string;
  top_findings: RecommendationInputFinding[];
  question_evidence_strength_score: number;
  question_evidence_strength_band: string;
}

const TOP_FINDINGS_PER_QUESTION = 3;

export function toRecommendationPromptInput(questionInsights: ValidatedQuestionInsight[]): RecommendationInputInsight[] {
  return questionInsights.map((qi) => ({
    question_id: qi.question_id,
    question: qi.question,
    answer_status: qi.answer_status,
    direct_answer: qi.direct_answer,
    category_expansion_relevance: qi.category_expansion_connection.relevance,
    top_findings: [...qi.key_findings]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, TOP_FINDINGS_PER_QUESTION)
      .map((f) => ({
        rank: f.rank,
        finding: f.finding,
        category_expansion_relevance: f.category_expansion_relevance,
        frequency: f.frequency,
        severity: f.severity,
        product_implication: f.product_implication,
        supporting_review_ids: f.supporting_review_ids,
        evidence_strength_band: f.evidence_strength.evidence_strength_band,
      })),
    question_evidence_strength_score: qi.question_evidence_strength.evidence_strength_score,
    question_evidence_strength_band: qi.question_evidence_strength.evidence_strength_band,
  }));
}

export function buildRecommendationPrompt(
  stats: AggregationStats,
  insights: RecommendationInputInsight[]
): string {
  return `You are a Senior Product Manager translating validated, evidence-scored product research into a prioritised roadmap.

The strategic objective is:

Increase the percentage of Monthly Active Customers who purchase from at least one new product category in a month.

You are given the aggregated review statistics and a set of research question insights. Each insight has already been through an evidence-strength scoring process — treat \`question_evidence_strength_band\` / \`evidence_strength_band\` as a measure of how well-supported that finding is, not as a probability.

## RULES

1. Every recommendation must be traceable to one or more supplied findings. Do not invent a recommendation that isn't grounded in the supplied \`top_findings\`.
2. At least 6 of the recommendations you generate must be based on findings whose \`category_expansion_relevance\` is \`direct_category_expansion\` or \`indirect_category_expansion\`. At most 2 recommendations may be based on \`general_platform_issue\` findings — this research programme exists to grow category expansion, not to produce a generic platform backlog.
3. Every recommendation must cite:
   - \`based_on_question_ids\`: the question_id(s) it draws from
   - \`supporting_finding_refs\`: the exact \`{question_id, finding_rank}\` pairs it draws from
   - \`supporting_review_ids\`: review IDs drawn ONLY from the \`supporting_review_ids\` already present on the cited findings — do not invent or add review IDs that were not supplied.
4. Do not cite a finding, question, or review ID that is not present in the supplied insights.
5. If a recommendation is based on a finding with an \`evidence_strength_band\` of \`low\` or \`insufficient\`, frame it as a validation-first action (e.g. "run a survey/interview to confirm X" as a quick_win or long_term item), not as a confident build recommendation. Do not launder weak evidence into a confidently-worded feature commitment.
6. Insights are not recommendations — you are the one translating an evidence-backed problem into an action; state the recommendation itself in \`title\`/\`description\`, do not restate the finding.
7. Do not fabricate statistics beyond what is in \`aggregated_stats\` or the supplied findings.

## PRIORITY TIERS

- quick_win: Easy to implement, high impact, low effort (1-2 weeks)
- medium: Moderate effort, meaningful impact (1-3 months)
- high: Significant effort, high strategic value (3-6 months)
- long_term: Major initiatives, transformative impact (6+ months)

Generate at least 2 recommendations per priority tier (8 total minimum), respecting rule 2 above across the full set.

## INPUTS

REVIEW STATISTICS:
${JSON.stringify(stats, null, 2)}

RESEARCH INSIGHTS (evidence-scored):
${JSON.stringify(insights, null, 2)}

## OUTPUT

Return ONLY valid JSON in this exact shape:
{
  "recommendations": [
    {
      "priority": "quick_win|medium|high|long_term",
      "title": "<short title>",
      "description": "<detailed description of what to do and why, referencing the finding(s) it is based on>",
      "category_expansion_relevance": "direct_category_expansion|indirect_category_expansion|general_platform_issue|not_relevant|unclear",
      "based_on_question_ids": [1, 2],
      "supporting_finding_refs": [{"question_id": 1, "finding_rank": 1}],
      "supporting_review_ids": ["id1", "id2"]
    }
  ]
}`;
}

# Insight Generation Prompt Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the thin insight-generation prompt with the user's rigorous senior-PM prompt, and flatten its rich nested JSON output back into the existing `{question, answer, confidence, supportingReviewIds}` shape so the DB, validator (for storage), repository, and frontend need zero changes.

**Architecture:** `buildInsightGenerationPrompt` grows a 4th input (`reviewAnalysis`, the per-review structured tags) and returns the new prompt text verbatim. `AIService.generateInsights` now parses the model's response as a single JSON object (validated against a new schema covering the pieces we consume), then flattens each `question_insights[]` entry down to the legacy shape before returning — so everything downstream of that method is untouched. `PipelineService` is updated only to build the two input arrays (`reviews`, `reviewAnalysis`) the new prompt needs.

**Tech Stack:** TypeScript, Express, Prisma, Zod. No test framework is installed in this repo (confirmed: no jest/vitest in `backend/package.json`, no `*.test.ts` files) — verification in this plan is `npx tsc --noEmit` per task plus one end-to-end manual pipeline run at the end, per user decision to skip adding test infrastructure for this change.

## Global Constraints

- Do not change `backend/src/validators/insight.validator.ts`'s existing `InsightSchema`/`InsightArraySchema` — they describe the final flattened shape and must keep validating it unchanged.
- Do not change `backend/src/repositories/insight.repository.ts`, the `Insight` Prisma model, or any file under `frontend/`.
- Do not change `backend/prompts/review-analysis.prompt.ts` or `backend/prompts/recommendation.prompt.ts`.
- `AIService.generateInsights`'s return type must remain exactly `Array<{ question: string; answer: string; confidence: number; supportingReviewIds: string[] }>`.
- The new prompt text in Task 1 must be reproduced verbatim (the user-authored senior-PM prompt) — do not paraphrase or shorten it.

---

### Task 1: Rewrite the insight-generation prompt builder

**Files:**
- Modify: `backend/prompts/insight-generation.prompt.ts` (full rewrite)

**Interfaces:**
- Produces: `buildInsightGenerationPrompt(stats: AggregationStats, reviews: Array<{id: string; review: string}>, reviewAnalysis: Array<{reviewId: string; sentiment: string; emotion: string; themes: string[]; painPoints: string[]; shoppingHabit?: string; barrier?: string; experimentLikelihood?: string; featureRequests: string[]; summary: string; confidence: number}>, questions: string[]): string` — consumed by Task 2.

- [ ] **Step 1: Replace the file contents**

Replace the entire contents of `backend/prompts/insight-generation.prompt.ts` with:

```ts
import { AggregationStats } from '../src/types';

export interface InsightPromptReview {
  id: string;
  review: string;
}

export interface InsightPromptReviewAnalysis {
  reviewId: string;
  sentiment: string;
  emotion: string;
  themes: string[];
  painPoints: string[];
  shoppingHabit?: string;
  barrier?: string;
  experimentLikelihood?: string;
  featureRequests: string[];
  summary: string;
  confidence: number;
}

export function buildInsightGenerationPrompt(
  stats: AggregationStats,
  reviews: InsightPromptReview[],
  reviewAnalysis: InsightPromptReviewAnalysis[],
  questions: string[]
): string {
  return `You are a Senior Product Manager and Product Research Analyst with 5–6 years of experience in consumer internet, e-commerce, and quick-commerce products.

Your task is to analyze aggregated customer-feedback data and representative raw reviews to produce evidence-backed answers to eight product research questions.

You are conducting secondary research. Do not invent user motivations, behaviours, or statistics that are not supported by the provided data.

## INPUTS

You will receive:

1. \`aggregated_stats\`

   * Sentiment distribution
   * Emotion distribution
   * Theme frequencies
   * Pain-point frequencies
   * Shopping-habit distribution
   * Buying-barrier distribution
   * New-category trial likelihood
   * Feature-request frequencies
   * Source distribution
   * Rating distribution
   * Time-based trends, if available
   * Any other calculated metrics

2. \`reviews\`

   * A representative sample of raw reviews
   * Each review contains a unique \`review_id\`
   * Reviews may come from the App Store, Play Store, Reddit, Twitter/X, or other sources
   * Reviews may contain multiple themes, mixed sentiment, sarcasm, incomplete information, or language errors

3. \`review_analysis\`

   * Per-review structured tags, where available
   * Sentiment
   * Emotion
   * Themes
   * Pain points
   * Shopping habits
   * Buying barriers
   * Likelihood to try new categories
   * Feature requests
   * Summary
   * Confidence

4. \`questions\`

   * The eight fixed research questions listed below

## RESEARCH QUESTIONS

1. Why do users repeatedly buy from the same categories?
2. What prevents users from exploring new categories?
3. How do users discover products today?
4. What role do habits play in purchasing behaviour?
5. What information do users need before trying a new category?
6. What frustrations emerge repeatedly across reviews?
7. Which types of users experiment more with new products?
8. What unmet needs appear consistently in user feedback?

## CORE ANALYSIS RULES

### 1. Use evidence, not assumptions

Every important claim must be supported by one or more of the following:

* Aggregated statistics
* Repeated patterns across reviews
* Specific review IDs
* Clear comparisons across user groups, ratings, sources, themes, or behaviours

Do not present general e-commerce knowledge as a finding unless the supplied data supports it.

### 2. Separate direct evidence from inference

Classify findings as:

* \`direct\`: explicitly stated by users
* \`inferred\`: reasonably concluded from repeated patterns
* \`insufficient_evidence\`: plausible, but not adequately supported

Clearly label inferred findings.

### 3. Consider frequency and severity separately

A problem may be:

* High-frequency but low-severity
* Low-frequency but high-severity
* Both frequent and severe
* Neither

For example, a complaint about small handling fees may appear frequently, while an expired product or failed refund may be less frequent but more damaging to trust.

### 4. Identify behavioural chains

Where possible, connect findings using this structure:

\`Trigger → User perception → Behaviour → Product consequence\`

Example:

Unexpected checkout fee → User perceives poor value or manipulation → User abandons the purchase or compares competitors → Reduced conversion and lower willingness to explore unfamiliar categories

Only include such chains when supported by evidence.

### 5. Look beyond sentiment

Do not treat positive sentiment as the absence of a problem.

A review may praise fast delivery while also mentioning:

* High prices
* Poor product quality
* Extra charges
* Limited support
* Low trust
* Category-specific concerns

Capture mixed and contradictory feedback.

### 6. Analyse segments where possible

Look for meaningful differences across:

* New versus repeat users
* High-rating versus low-rating users
* Convenience-led versus price-sensitive users
* Urgent or last-minute shoppers
* Planned shoppers
* Users buying essentials versus non-essential products
* Users with positive versus negative support experiences
* Users with high versus low willingness to try new categories
* Platform or source
* Geography, when available
* Time period or app version, when available

Do not create a segment unless the data supports it.

### 7. Distinguish platform problems from discovery problems

Separate issues related to:

* Product discovery
* Category awareness
* Relevance of recommendations
* Trust in unfamiliar products
* Pricing and charges
* Delivery quality
* Product quality
* Refunds and customer support
* App usability
* Inventory availability

Do not incorrectly classify every negative review as a discovery barrier.

### 8. Account for data limitations

The review dataset may overrepresent:

* Highly satisfied users
* Highly dissatisfied users
* Delivery and support complaints
* Recent incidents
* Public complaints from social media

Mention these limitations where they materially affect confidence.

## REQUIRED ANALYSIS PROCESS

For each question:

1. Identify the strongest answer supported by the data.
2. Break the answer into distinct findings.
3. Rank findings by importance.
4. Support each finding with quantitative and qualitative evidence.
5. Include relevant review IDs.
6. Note contradictions or counter-evidence.
7. Identify affected user segments.
8. Explain the product or business implication.
9. State evidence gaps.
10. Assign a confidence score.

## CONFIDENCE SCORING

Use a score from \`0.00\` to \`1.00\`.

* \`0.90–1.00\`: Strong pattern supported by statistics and multiple independent reviews
* \`0.75–0.89\`: Clear repeated pattern with good supporting evidence
* \`0.60–0.74\`: Moderate evidence, but some inference or sample limitation
* \`0.40–0.59\`: Weak or mixed evidence
* Below \`0.40\`: Insufficient evidence for a reliable conclusion

Do not give high confidence merely because a conclusion sounds reasonable.

## OUTPUT REQUIREMENTS

Return valid JSON only.

Do not include markdown, commentary, or text outside the JSON.

Use this exact structure:

{
"executive_summary": {
"overall_behavioral_pattern": "Concise explanation of the dominant user behaviour visible across the dataset.",
"top_growth_barriers": [
{
"barrier": "Name of barrier",
"why_it_matters": "Impact on category exploration or purchasing behaviour",
"evidence_type": "direct | inferred",
"supporting_review_ids": ["review_id_1", "review_id_2"]
}
],
"top_growth_opportunities": [
{
"opportunity": "Name of opportunity",
"why_it_matters": "How this could increase category exploration",
"evidence_type": "direct | inferred",
"supporting_review_ids": ["review_id_3", "review_id_4"]
}
],
"overall_confidence": 0.00
},
"question_insights": [
{
"question_id": 1,
"question": "Why do users repeatedly buy from the same categories?",
"direct_answer": "A clear 2–4 sentence answer to the question.",
"key_findings": [
{
"rank": 1,
"finding": "A distinct, non-overlapping finding.",
"explanation": "Detailed explanation of the pattern.",
"evidence_type": "direct | inferred",
"quantitative_evidence": [
{
"metric": "Relevant metric name",
"value": "Metric value",
"interpretation": "What the metric indicates"
}
],
"qualitative_evidence": [
{
"review_id": "review_id",
"evidence_summary": "Paraphrased evidence from the review"
}
],
"affected_segments": [
"Relevant user segment"
],
"behavioral_chain": {
"trigger": "What starts the behaviour",
"perception": "How the user interprets it",
"behavior": "What the user does",
"product_consequence": "Impact on the product or business"
},
"frequency": "high | medium | low | unknown",
"severity": "high | medium | low | unknown",
"product_implication": "Why this finding matters for product decisions"
}
],
"counter_evidence": [
{
"observation": "Evidence that challenges or qualifies the main conclusion",
"supporting_review_ids": ["review_id"]
}
],
"evidence_gaps": [
"Information required to answer this question more confidently"
],
"supporting_review_ids": [
"All unique review IDs used for this question"
],
"confidence_score": 0.00,
"confidence_reason": "Why this confidence level was assigned"
}
],
"cross_question_patterns": [
{
"pattern": "Pattern appearing across multiple questions",
"related_question_ids": [1, 2, 4],
"explanation": "How the pattern connects the answers",
"supporting_review_ids": ["review_id_1", "review_id_2"],
"confidence_score": 0.00
}
],
"user_segments": [
{
"segment_name": "Evidence-based segment name",
"segment_description": "Observable behaviour and needs",
"defining_signals": [
"Signals used to identify the segment"
],
"primary_motivations": [
"Motivation supported by the data"
],
"main_barriers": [
"Barrier supported by the data"
],
"category_exploration_likelihood": "high | medium | low | unknown",
"relevant_question_ids": [1, 2, 7],
"supporting_review_ids": ["review_id_1", "review_id_2"],
"confidence_score": 0.00
}
],
"research_limitations": [
{
"limitation": "Dataset or methodology limitation",
"impact": "How it may affect the findings",
"recommended_validation": "Primary or quantitative research needed"
}
],
"quality_checks": {
"all_eight_questions_answered": true,
"all_major_claims_have_evidence": true,
"all_review_ids_exist_in_input": true,
"unsupported_claims_removed": true,
"direct_and_inferred_findings_separated": true,
"contradictory_evidence_considered": true,
"duplicate_findings_removed": true
}
}

## QUESTION-SPECIFIC GUIDANCE

### Question 1: Why do users repeatedly buy from the same categories?

Examine:

* Convenience
* Urgency
* Familiarity
* Repeat household needs
* Saved preferences
* Trust in known brands
* Reduced decision effort
* Previous successful purchases
* Availability of frequently purchased items
* Lack of motivation to browse

Do not assume repetition is negative. It may indicate strong product-market fit for essential categories.

### Question 2: What prevents users from exploring new categories?

Examine:

* Lack of awareness
* Poor category visibility
* Weak recommendations
* Price sensitivity
* Extra charges
* Product-quality concerns
* Trust barriers
* Return or refund concerns
* Insufficient product information
* Limited assortment
* Poor availability
* Negative prior experiences
* Perceived irrelevance
* High cognitive effort

Separate barriers to browsing from barriers to final purchase.

### Question 3: How do users discover products today?

Look for direct or indirect discovery through:

* Search
* Home-page recommendations
* Offers and discounts
* Category browsing
* Repeat purchase lists
* Urgent needs
* Social media
* Advertising
* Word of mouth
* Product availability
* Cross-category recommendations
* Seasonal or event-based needs

When the dataset does not directly show discovery behaviour, state that evidence is insufficient rather than guessing.

### Question 4: What role do habits play in purchasing behaviour?

Examine:

* Recurring household purchases
* Last-minute ordering
* Default platform usage
* Repeat brands
* Repeat categories
* Convenience dependence
* Time-saving behaviour
* Purchase frequency
* Reduced comparison
* Loyalty despite dissatisfaction

Identify whether habit strengthens retention while simultaneously reducing exploration.

### Question 5: What information do users need before trying a new category?

Examine:

* Price transparency
* Final landed cost
* Ratings and reviews
* Product freshness
* Expiry date
* Manufacturing date
* Product images
* Ingredients
* Specifications
* Brand trust
* Return eligibility
* Refund process
* Warranty
* Authenticity
* Delivery conditions
* Availability
* Comparison information

Separate information explicitly requested by users from information inferred through complaints.

### Question 6: What frustrations emerge repeatedly across reviews?

Group frustrations into distinct clusters.

For every cluster, assess:

* Frequency
* Severity
* Stage of journey
* Impact on trust
* Impact on retention
* Impact on category exploration

Avoid listing near-duplicate frustrations separately.

### Question 7: Which types of users experiment more with new products?

Look for evidence of experimentation among:

* Highly engaged users
* Convenience-first users
* Users praising assortment
* Offer-sensitive users
* Urgent-need users
* Users already buying across multiple categories
* Users requesting new products or categories
* Users purchasing electronics, printouts, personal care, or other non-core categories

Do not infer demographic characteristics unless explicitly available.

### Question 8: What unmet needs appear consistently in user feedback?

Differentiate:

* Explicit feature requests
* Repeated unresolved pain points
* Missing information
* Missing service capabilities
* Trust-related needs
* Support-related needs
* Discovery-related needs
* Accessibility, language, or preference needs

An unmet need should describe the underlying user need, not only the requested feature.

Example:

Feature request: "Allow users to hide non-vegetarian products."

Underlying unmet need: "Users want greater control over category visibility based on personal preferences."

## FINAL VALIDATION BEFORE RESPONDING

Before producing the JSON, verify:

1. Exactly eight question objects are included.
2. Every question directly answers the wording of the question.
3. Findings within a question do not repeat each other.
4. Review IDs are used only when present in the supplied inputs.
5. Major claims include evidence.
6. Aggregate metrics are not fabricated.
7. Correlation is not presented as causation.
8. User types are behaviour-based, not invented demographics.
9. Mixed sentiment and contradictory evidence are preserved.
10. Low-evidence questions receive lower confidence scores.
11. Insights are separated from recommendations.
12. The response contains valid parseable JSON only.

Now analyse the following input:

aggregated_stats:
${JSON.stringify(stats, null, 2)}

review_analysis:
${JSON.stringify(reviewAnalysis, null, 2)}

reviews:
${JSON.stringify(reviews, null, 2)}

questions:
${JSON.stringify(questions, null, 2)}`;
}
```

- [ ] **Step 2: Type-check**

Run: `cd backend && npx tsc --noEmit`
Expected: No errors mentioning `insight-generation.prompt.ts`. (Errors in unrelated files, if any pre-existed, are not caused by this change — check with `git stash` + rerun if unsure.)

- [ ] **Step 3: Commit**

```bash
git add backend/prompts/insight-generation.prompt.ts
git commit -m "Rewrite insight-generation prompt with senior-PM evidence-based analysis"
```

---

### Task 2: Add the rich-response validator and flatten it in AIService

**Files:**
- Modify: `backend/src/validators/insight.validator.ts`
- Modify: `backend/src/services/ai.service.ts:64-96` (the `generateInsights` method)

**Interfaces:**
- Consumes: `buildInsightGenerationPrompt` from Task 1 (`InsightPromptReview`, `InsightPromptReviewAnalysis` types).
- Produces: `AIService.generateInsights(stats: AggregationStats, reviews: InsightPromptReview[], reviewAnalysis: InsightPromptReviewAnalysis[]): Promise<Array<{question: string; answer: string; confidence: number; supportingReviewIds: string[]}>>` — consumed by Task 3 (`PipelineService`) unchanged in return shape from today.

- [ ] **Step 1: Add the rich-response schema to the validator file**

In `backend/src/validators/insight.validator.ts`, keep the existing `InsightSchema`/`InsightArraySchema` untouched and append:

```ts
const KeyFindingSchema = z.object({
  rank: z.number(),
  finding: z.string().min(1),
  explanation: z.string().min(1),
});

const QuestionInsightSchema = z.object({
  question: z.string().min(1),
  direct_answer: z.string().min(1),
  key_findings: z.array(KeyFindingSchema),
  supporting_review_ids: z.array(z.string()),
  confidence_score: z.number().min(0).max(1),
});

export const InsightGenerationResponseSchema = z
  .object({
    question_insights: z.array(QuestionInsightSchema),
  })
  .passthrough();

export type ValidatedQuestionInsight = z.infer<typeof QuestionInsightSchema>;
```

The full file should now read:

```ts
import { z } from 'zod';

export const InsightSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  confidence: z.number().min(0).max(1),
  supportingReviewIds: z.array(z.string()),
});

export const InsightArraySchema = z.array(InsightSchema);

export type ValidatedInsight = z.infer<typeof InsightSchema>;

const KeyFindingSchema = z.object({
  rank: z.number(),
  finding: z.string().min(1),
  explanation: z.string().min(1),
});

const QuestionInsightSchema = z.object({
  question: z.string().min(1),
  direct_answer: z.string().min(1),
  key_findings: z.array(KeyFindingSchema),
  supporting_review_ids: z.array(z.string()),
  confidence_score: z.number().min(0).max(1),
});

export const InsightGenerationResponseSchema = z
  .object({
    question_insights: z.array(QuestionInsightSchema),
  })
  .passthrough();

export type ValidatedQuestionInsight = z.infer<typeof QuestionInsightSchema>;
```

(`.passthrough()` lets `executive_summary`, `cross_question_patterns`, `user_segments`, `research_limitations`, and `quality_checks` exist on the parsed object without being typed or validated — they're read by nothing and discarded.)

- [ ] **Step 2: Update `generateInsights` in `ai.service.ts`**

Replace lines 1-11 (imports) with:

```ts
import { AIProvider } from '../lib/ai-provider.interface';
import { createAIProvider } from '../lib/ai-provider.factory';
import { buildReviewAnalysisPrompt } from '../../prompts/review-analysis.prompt';
import {
  buildInsightGenerationPrompt,
  InsightPromptReview,
  InsightPromptReviewAnalysis,
} from '../../prompts/insight-generation.prompt';
import { buildRecommendationPrompt } from '../../prompts/recommendation.prompt';
import { AnalysisResultArraySchema } from '../validators/analysis.validator';
import { InsightGenerationResponseSchema } from '../validators/insight.validator';
import { RecommendationArraySchema } from '../validators/recommendation.validator';
import { AnalysisResult, AggregationStats } from '../types';
import { INSIGHT_QUESTIONS } from '../constants';
import { parseJsonSafe } from '../utils/json-parse';
```

Replace the entire `generateInsights` method (originally lines 64-96) with:

```ts
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
    const prompt = buildInsightGenerationPrompt(stats, reviews, reviewAnalysis, INSIGHT_QUESTIONS);

    let raw: string;
    try {
      raw = await this.provider.complete(prompt);
    } catch (err) {
      throw new Error(`AI provider error during insight generation: ${String(err)}`);
    }

    let parsed = parseJsonSafe<unknown>(raw);
    if (!parsed) {
      raw = await this.provider.complete(prompt);
      parsed = parseJsonSafe<unknown>(raw);
    }

    if (!parsed) {
      throw new Error('Failed to parse insight response after retry');
    }

    const validated = InsightGenerationResponseSchema.parse(parsed);

    return validated.question_insights.map((qi) => {
      const findingLines = [...qi.key_findings]
        .sort((a, b) => a.rank - b.rank)
        .map((f) => `• ${f.finding}: ${f.explanation}`)
        .join('\n');

      return {
        question: qi.question,
        answer: findingLines ? `${qi.direct_answer}\n\n${findingLines}` : qi.direct_answer,
        confidence: qi.confidence_score,
        supportingReviewIds: [...new Set(qi.supporting_review_ids)],
      };
    });
  }
```

Leave `analyzeReviews` and `generateRecommendations` unchanged.

- [ ] **Step 3: Type-check**

Run: `cd backend && npx tsc --noEmit`
Expected: No errors in `insight.validator.ts` or `ai.service.ts`.

- [ ] **Step 4: Commit**

```bash
git add backend/src/validators/insight.validator.ts backend/src/services/ai.service.ts
git commit -m "Validate rich insight-generation response and flatten it to the legacy Insight shape"
```

---

### Task 3: Wire the new inputs through PipelineService

**Files:**
- Modify: `backend/src/services/pipeline.service.ts:119-131`

**Interfaces:**
- Consumes: `AIService.generateInsights(stats, reviews, reviewAnalysis)` from Task 2; `InsightPromptReview`, `InsightPromptReviewAnalysis` types from `backend/prompts/insight-generation.prompt.ts`.

- [ ] **Step 1: Replace the representative-reviews block**

In `backend/src/services/pipeline.service.ts`, replace:

```ts
      // Step 4: Generate insights
      statusService.setStatus('generating_insights', 80, 'Generating insights');
      const representativeReviews = allReviews
        .filter((r) => r.analysis !== null)
        .slice(0, 20)
        .map((r) => ({
          id: r.id,
          review: r.review,
          sentiment: r.analysis!.sentiment,
        }));

      const insights = await this.aiService.generateInsights(stats, representativeReviews);
```

with:

```ts
      // Step 4: Generate insights
      statusService.setStatus('generating_insights', 80, 'Generating insights');
      const analyzedSample = allReviews.filter((r) => r.analysis !== null).slice(0, 20);

      const reviews = analyzedSample.map((r) => ({
        id: r.id,
        review: r.review,
      }));

      const reviewAnalysis = analyzedSample.map((r) => ({
        reviewId: r.id,
        sentiment: r.analysis!.sentiment,
        emotion: r.analysis!.emotion,
        themes: JSON.parse(r.analysis!.themes) as string[],
        painPoints: JSON.parse(r.analysis!.painPoints) as string[],
        shoppingHabit: r.analysis!.shoppingHabit ?? undefined,
        barrier: r.analysis!.barrier ?? undefined,
        experimentLikelihood: r.analysis!.experimentLikelihood ?? undefined,
        featureRequests: JSON.parse(r.analysis!.featureRequests) as string[],
        summary: r.analysis!.summary,
        confidence: r.analysis!.confidence,
      }));

      const insights = await this.aiService.generateInsights(stats, reviews, reviewAnalysis);
```

- [ ] **Step 2: Type-check**

Run: `cd backend && npx tsc --noEmit`
Expected: No errors in `pipeline.service.ts`.

- [ ] **Step 3: Commit**

```bash
git add backend/src/services/pipeline.service.ts
git commit -m "Pass full per-review analysis tags into insight generation"
```

---

### Task 4: End-to-end manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the backend**

Run: `cd backend && npm run dev`
Expected: Server starts without throwing, listening on its configured port.

- [ ] **Step 2: Trigger the pipeline**

Run: `curl -X POST http://localhost:<PORT>/api/analyze` (substitute the actual port from server startup logs)
Expected: `{"success":true,"message":"Pipeline started. Poll /api/status for progress."}`

- [ ] **Step 3: Poll status until complete**

Run: `curl http://localhost:<PORT>/api/status`
Expected: status eventually reaches `"completed"` (not `"error"`). If it errors, read the message — most likely cause is the model not returning valid JSON matching `InsightGenerationResponseSchema`; check the raw response shape against the schema in Task 2.

- [ ] **Step 4: Confirm insights were flattened correctly**

Run: `curl http://localhost:<PORT>/api/insights`
Expected: A JSON array of exactly 8 objects, each with non-empty `question`, `answer` (containing the direct answer followed by bullet-pointed findings), `confidence` between 0 and 1, and `supportingReviewIds` as a string array.

- [ ] **Step 5: Confirm the frontend renders it unchanged**

Run: `cd frontend && npm run dev`, open the Insights page in a browser.
Expected: 8 insight cards render exactly as before (question, answer text with bullets now visible in the body, confidence badge/bar, supporting review ID chips) — no frontend code changed, so this is a regression check, not a new feature check.

- [ ] **Step 6: Commit (only if any fixups were needed in prior tasks)**

If everything worked with no code changes, there is nothing to commit for this task. If a fixup was required, commit it with a message describing what the manual run revealed.

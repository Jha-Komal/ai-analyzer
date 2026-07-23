# Insight Generation Prompt Upgrade

## Problem

`buildInsightGenerationPrompt` currently produces a thin prompt: it hands the model
aggregated stats, a small sample of representative reviews, and the 8 fixed research
questions, and asks for a flat JSON array of `{question, answer, confidence,
supportingReviewIds}`. The answers this produces are shallow — no ranked findings, no
distinction between direct and inferred evidence, no behavioral chains, no segment
analysis.

The user supplied a much more rigorous prompt (senior-PM persona, explicit evidence
rules, confidence-scoring rubric, per-question guidance, and a rich nested JSON output
schema: `executive_summary`, `question_insights[]` with ranked `key_findings`,
`cross_question_patterns`, `user_segments`, `research_limitations`, `quality_checks`).

## Decision: flatten back down, don't migrate storage

Adopting the new prompt's *output shape* wholesale would cascade into the DB schema
(`Insight` Prisma model), `insight.validator.ts`, `InsightRepository`, and the entire
frontend (`InsightsPage.tsx`, `useInsights.ts`, `types/insight.ts`). The user chose to
avoid that: use the new prompt to get better-reasoned answers, but flatten the rich
response back into the existing `{question, answer, confidence, supportingReviewIds}`
shape inside `AIService.generateInsights`, so nothing downstream of that method changes.

## Changes

### 1. `backend/prompts/insight-generation.prompt.ts`

`buildInsightGenerationPrompt` takes four params instead of three:

```ts
function buildInsightGenerationPrompt(
  stats: AggregationStats,
  reviews: Array<{ id: string; review: string }>,
  reviewAnalysis: Array<{
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
  }>,
  questions: string[]
): string
```

The function body is the user's supplied prompt text verbatim, with `stats`,
`reviews`, `reviewAnalysis`, and `questions` serialized (JSON.stringify) into the
`## INPUTS` section in place of the `{{...}}` placeholders. The output contract
(nested JSON object) stays exactly as specified in that prompt.

### 2. `backend/src/services/ai.service.ts` — `generateInsights`

- New signature: `generateInsights(stats, reviews, reviewAnalysis)`.
- The model now returns a single JSON **object**, not an array. `parseJsonSafe`
  already handles object payloads (it has an `objectMatch` fallback), so no change
  needed there — just parse as `unknown` instead of `unknown[]`.
- Add a new Zod schema (in `insight.validator.ts` or a sibling file) that validates
  the parts of the response we actually consume — `question_insights[]` with
  `question`, `direct_answer`, `key_findings[]` (`rank`, `finding`, `explanation`),
  `confidence_score`, `supporting_review_ids` — and leaves the rest of the object
  (`executive_summary`, `cross_question_patterns`, `user_segments`,
  `research_limitations`, `quality_checks`) untyped/passthrough since it's discarded.
- Flatten: for each `question_insights[i]`, produce
  ```ts
  {
    question: qi.question,
    answer: qi.direct_answer + '\n\n' + qi.key_findings
      .sort((a, b) => a.rank - b.rank)
      .map(f => `• ${f.finding}: ${f.explanation}`)
      .join('\n'),
    confidence: qi.confidence_score,
    supportingReviewIds: [...new Set(qi.supporting_review_ids)],
  }
  ```
- Return type is unchanged: `Array<{question, answer, confidence, supportingReviewIds}>`.
- Existing retry-once-on-parse-failure behavior is preserved.

### 3. `backend/src/services/pipeline.service.ts`

Where `representativeReviews` is currently built as `{id, review, sentiment}`, split
into two arrays sourced from the same `allReviews.filter(r => r.analysis !== null).slice(0, 20)`:

- `reviews`: `{id, review}`
- `reviewAnalysis`: `{reviewId, sentiment, emotion, themes: JSON.parse(analysis.themes), painPoints: JSON.parse(analysis.painPoints), shoppingHabit, barrier, experimentLikelihood, featureRequests: JSON.parse(analysis.featureRequests), summary, confidence}`

(JSON-string columns parsed the same way `aggregation.service.ts` already does.)

Call site becomes `aiService.generateInsights(stats, reviews, reviewAnalysis)`.

### 4. Discarded fields

`executive_summary`, `cross_question_patterns`, `user_segments`,
`research_limitations`, `quality_checks` are parsed (to keep validation honest) but
not stored or logged. Revisit surfacing them later if the Insights page is expanded.

## Out of scope

- No changes to `insight.validator.ts`'s existing `InsightArraySchema`/`InsightSchema`
  (still describes the final flattened shape).
- No changes to `insight.repository.ts`, the `Insight` Prisma model, or anything under
  `frontend/`.
- No changes to `review-analysis.prompt.ts` or `recommendation.prompt.ts`.

## Testing

- Unit test for the flattening logic in `AIService.generateInsights` (given a sample
  rich JSON response, assert the flattened array shape and bullet formatting).
- Manual run of the full pipeline against seeded dev data to confirm the model
  reliably returns the new schema and the flattened insights render correctly on
  the existing Insights page.

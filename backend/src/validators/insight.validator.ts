import { z } from 'zod';

// ── Shared leaf helpers ──────────────────────────────────────────────────
// Lenient-by-default: nothing here throws. Every field that isn't essential
// to rendering an item degrades to a safe default via `.catch()`. Only a
// handful of fields (checked per-schema below) are hard-required — failing
// those drops just that one item at the service layer, never the batch.

const strArray = z.array(z.string()).catch([]);
const looseStringArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.filter((v): v is string => typeof v === 'string'));

const evidenceType = z.enum(['direct', 'inferred', 'insufficient_evidence']).catch('insufficient_evidence');
const categoryExpansionRelevance = z
  .enum(['direct_category_expansion', 'indirect_category_expansion', 'general_platform_issue', 'not_relevant', 'unclear'])
  .catch('unclear');
const expansionStage = z
  .enum(['awareness', 'consideration', 'evaluation', 'add_to_cart', 'first_purchase', 'repeat_purchase'])
  .catch('awareness');
const frequencySeverity = z.enum(['high', 'medium', 'low', 'unknown']).catch('unknown');
const evidenceStrengthBand = z.enum(['high', 'medium', 'low', 'insufficient']).catch('insufficient');
const answerStatus = z.enum(['supported', 'partially_supported', 'insufficient_evidence']).catch('insufficient_evidence');
const behavioralChainStatus = z.enum(['supported', 'partially_supported', 'insufficient_evidence']).catch('insufficient_evidence');
const behavioralChainEvidenceType = z.enum(['direct', 'partially_inferred', 'inferred']).catch('inferred');
const score01 = z.number().catch(0).transform((n) => Math.max(0, Math.min(1, n)));
const score0100 = z.number().catch(0).transform((n) => Math.max(0, Math.min(100, n)));

// ── Evidence-strength block (reused at finding-level and question-level) ──

export const EvidenceStrengthSchema = z
  .object({
    evidence_volume_score: score0100,
    evidence_relevance_score: score0100,
    source_diversity_score: score0100,
    consistency_score: score0100,
    evidence_quality_score: score0100,
    evidence_strength_score: score01,
    evidence_strength_band: evidenceStrengthBand,
    score_reason: z.string().catch(''),
  })
  .catch({
    evidence_volume_score: 0,
    evidence_relevance_score: 0,
    source_diversity_score: 0,
    consistency_score: 0,
    evidence_quality_score: 0,
    evidence_strength_score: 0,
    evidence_strength_band: 'insufficient',
    score_reason: '',
  });

// ── Quantitative / qualitative evidence ──────────────────────────────────

const QuantitativeEvidenceSchema = z
  .object({
    metric: z.string().catch(''),
    value: z.union([z.string(), z.number()]).catch('').transform(String),
    population_or_denominator: z.string().catch(''),
    data_scope: z.enum(['full_corpus', 'sample', 'unknown']).catch('unknown'),
    interpretation: z.string().catch(''),
    limitation: z.string().catch(''),
  })
  .nullable().catch(null);
const quantitativeEvidenceArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.map((v) => QuantitativeEvidenceSchema.parse(v)).filter((v): v is NonNullable<typeof v> => v !== null));

const QualitativeEvidenceSchema = z
  .object({
    review_id: z.string().catch(''),
    source: z.string().catch(''),
    evidence_summary: z.string().catch(''),
    evidence_type: z.enum(['direct', 'inferred']).catch('inferred'),
    category_expansion_relevance: z.enum(['direct_category_expansion', 'indirect_category_expansion']).catch('indirect_category_expansion'),
    why_it_supports_the_finding: z.string().catch(''),
  })
  .nullable().catch(null);
const qualitativeEvidenceArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.map((v) => QualitativeEvidenceSchema.parse(v)).filter((v): v is NonNullable<typeof v> => v !== null))
  .transform((arr) => arr.filter((v) => v.review_id.length > 0));

const AffectedSegmentSchema = z
  .object({
    segment_name: z.string().catch(''),
    observable_signals: strArray,
    why_affected: z.string().catch(''),
  })
  .nullable().catch(null);
const affectedSegmentsArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.map((v) => AffectedSegmentSchema.parse(v)).filter((v): v is NonNullable<typeof v> => v !== null && v.segment_name.length > 0));

const BehavioralChainSchema = z
  .object({
    status: behavioralChainStatus,
    evidence_type: behavioralChainEvidenceType,
    trigger: z.string().catch(''),
    user_perception: z.string().catch(''),
    behavior: z.string().catch(''),
    category_expansion_consequence: z.string().catch(''),
  })
  .catch({
    status: 'insufficient_evidence' as const,
    evidence_type: 'inferred' as const,
    trigger: '',
    user_perception: '',
    behavior: '',
    category_expansion_consequence: '',
  });

// ── Key finding ───────────────────────────────────────────────────────────
// `finding` is the one hard-required field — everything else defaults safely.

export const KeyFindingSchema = z.object({
  rank: z.number().catch(0),
  finding: z.string().min(1),
  observation: z.string().catch(''),
  interpretation: z.string().catch(''),
  interpretation_type: evidenceType,
  category_expansion_relevance: categoryExpansionRelevance,
  affected_category_expansion_stage: z.array(expansionStage).catch([]),
  quantitative_evidence: quantitativeEvidenceArray,
  qualitative_evidence: qualitativeEvidenceArray,
  affected_segments: affectedSegmentsArray,
  behavioral_chain: BehavioralChainSchema,
  frequency: frequencySeverity,
  severity: frequencySeverity,
  product_implication: z.string().catch(''),
  decision_enabled: z.string().catch(''),
  supporting_review_ids: looseStringArray,
  contradicting_review_ids: looseStringArray,
  limitations: strArray,
  evidence_strength: EvidenceStrengthSchema,
});

export type ValidatedKeyFinding = z.infer<typeof KeyFindingSchema>;

// ── Question-level supporting blocks ─────────────────────────────────────

const CategoryExpansionConnectionSchema = z
  .object({
    connection: z.string().catch(''),
    affected_stage: z.array(expansionStage).catch([]),
    relevance: categoryExpansionRelevance,
  })
  .catch({ connection: '', affected_stage: [], relevance: 'unclear' as const });

const CounterEvidenceSchema = z
  .object({
    observation: z.string().catch(''),
    how_it_changes_the_conclusion: z.string().catch(''),
    supporting_review_ids: looseStringArray,
  })
  .nullable().catch(null);
const counterEvidenceArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.map((v) => CounterEvidenceSchema.parse(v)).filter((v): v is NonNullable<typeof v> => v !== null));

const ExcludedIssueSchema = z
  .object({
    issue: z.string().catch(''),
    reason_excluded: z.string().catch('No supported connection to category expansion'),
    supporting_review_ids: looseStringArray,
  })
  .nullable().catch(null);
const excludedIssuesArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.map((v) => ExcludedIssueSchema.parse(v)).filter((v): v is NonNullable<typeof v> => v !== null));

const EligibilityConsiderationSchema = z
  .object({
    observation: z.string().catch(''),
    implication: z.string().catch(''),
    supporting_review_ids: looseStringArray,
  })
  .nullable().catch(null);
const eligibilityConsiderationsArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.map((v) => EligibilityConsiderationSchema.parse(v)).filter((v): v is NonNullable<typeof v> => v !== null));

const EvidenceGapSchema = z
  .object({
    gap: z.string().catch(''),
    why_it_matters: z.string().catch(''),
    recommended_validation: z.string().catch(''),
  })
  .nullable().catch(null);
const evidenceGapsArray = z
  .array(z.unknown())
  .catch([])
  .transform((arr) => arr.map((v) => EvidenceGapSchema.parse(v)).filter((v): v is NonNullable<typeof v> => v !== null && v.gap.length > 0));

// ── Question insight ──────────────────────────────────────────────────────
// `question` and `direct_answer` are the hard-required fields.

export const QuestionInsightSchema = z.object({
  question_id: z.number().catch(0),
  question: z.string().min(1),
  answer_status: answerStatus,
  direct_answer: z.string().min(1),
  category_expansion_connection: CategoryExpansionConnectionSchema,
  key_findings: z
    .array(z.unknown())
    .catch([]), // per-item validated in ai.service.ts, kept raw here deliberately
  counter_evidence: counterEvidenceArray,
  general_platform_issues_excluded: excludedIssuesArray,
  category_eligibility_considerations: eligibilityConsiderationsArray,
  evidence_gaps: evidenceGapsArray,
  all_supporting_review_ids: looseStringArray,
  question_evidence_strength: EvidenceStrengthSchema,
});

export type ValidatedQuestionInsightRaw = z.infer<typeof QuestionInsightSchema>;

// The fully-assembled, service-layer shape after key_findings has been
// per-item validated against KeyFindingSchema.
export interface ValidatedQuestionInsight extends Omit<ValidatedQuestionInsightRaw, 'key_findings'> {
  key_findings: ValidatedKeyFinding[];
}

// ── Batch-scoped artifacts ────────────────────────────────────────────────

export const BatchSummarySchema = z
  .object({
    questions_received: z.array(z.number()).catch([]),
    questions_answered: z.array(z.number()).catch([]),
    strategic_objective: z.string().catch(''),
    dominant_category_expansion_pattern: z.string().catch(''),
    dominant_pattern_evidence_type: evidenceType,
    dominant_pattern_supporting_review_ids: looseStringArray,
    dominant_pattern_evidence_strength_score: score01,
    important_scope_warning: z.string().catch(''),
    overall_evidence_limitations: strArray,
  })
  .nullable().catch(null);

export const CrossQuestionPatternSchema = z.object({
  pattern: z.string().min(1),
  related_question_ids: z.array(z.number()).catch([]),
  observation: z.string().catch(''),
  interpretation: z.string().catch(''),
  category_expansion_relevance: categoryExpansionRelevance,
  affected_stage: z.array(expansionStage).catch([]),
  supporting_review_ids: looseStringArray,
  contradicting_review_ids: looseStringArray,
  evidence_strength_score: score01,
  evidence_strength_band: evidenceStrengthBand,
});
export type ValidatedCrossQuestionPattern = z.infer<typeof CrossQuestionPatternSchema>;

export const BehavioralSegmentSchema = z.object({
  segment_name: z.string().min(1),
  segment_status: z.enum(['supported', 'provisional', 'insufficient_evidence']).catch('provisional'),
  behavioral_definition: z.string().catch(''),
  defining_signals: strArray,
  primary_job_or_context: z.string().catch(''),
  observed_behavior: z.string().catch(''),
  main_category_expansion_barriers: strArray,
  main_category_expansion_triggers: strArray,
  category_exploration_likelihood: z.enum(['high', 'medium', 'low', 'unknown']).catch('unknown'),
  category_eligibility_notes: z.string().catch(''),
  relevant_question_ids: z.array(z.number()).catch([]),
  supporting_review_ids: looseStringArray,
  contradicting_review_ids: looseStringArray,
  evidence_strength_score: score01,
  limitations: strArray,
});
export type ValidatedBehavioralSegment = z.infer<typeof BehavioralSegmentSchema>;

export const ResearchLimitationSchema = z.object({
  limitation: z.string().min(1),
  impact: z.string().catch(''),
  affected_questions: z.array(z.number()).catch([]),
  recommended_validation: z.string().catch(''),
});
export type ValidatedResearchLimitation = z.infer<typeof ResearchLimitationSchema>;

// ── Root response ─────────────────────────────────────────────────────────

export const InsightGenerationResponseSchema = z
  .object({
    batch_summary: BatchSummarySchema.optional(),
    question_insights: z.array(z.unknown()).catch([]), // per-item validated in ai.service.ts
    cross_question_patterns: z.array(z.unknown()).catch([]),
    behavioral_segments: z.array(z.unknown()).catch([]),
    research_limitations: z.array(z.unknown()).catch([]),
    quality_checks: z.record(z.string(), z.unknown()).catch({}),
  })
  .passthrough();

export type InsightGenerationResponse = z.infer<typeof InsightGenerationResponseSchema>;

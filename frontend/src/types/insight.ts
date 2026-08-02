export type EvidenceType = 'direct' | 'inferred' | 'insufficient_evidence';
export type CategoryExpansionRelevance =
  | 'direct_category_expansion'
  | 'indirect_category_expansion'
  | 'general_platform_issue'
  | 'not_relevant'
  | 'unclear';
export type ExpansionStage =
  | 'awareness'
  | 'consideration'
  | 'evaluation'
  | 'add_to_cart'
  | 'first_purchase'
  | 'repeat_purchase';
export type FrequencySeverity = 'high' | 'medium' | 'low' | 'unknown';
export type EvidenceStrengthBand = 'high' | 'medium' | 'low' | 'insufficient';
export type AnswerStatus = 'supported' | 'partially_supported' | 'insufficient_evidence';
export type BehavioralChainStatus = 'supported' | 'partially_supported' | 'insufficient_evidence';
export type BehavioralChainEvidenceType = 'direct' | 'partially_inferred' | 'inferred';

export interface EvidenceStrength {
  evidenceVolumeScore: number;
  evidenceRelevanceScore: number;
  sourceDiversityScore: number;
  consistencyScore: number;
  evidenceQualityScore: number;
  evidenceStrengthScore: number;
  evidenceStrengthBand: EvidenceStrengthBand;
  scoreReason: string;
}

export interface QuantitativeEvidence {
  metric: string;
  value: string;
  populationOrDenominator: string;
  dataScope: 'full_corpus' | 'sample' | 'unknown';
  interpretation: string;
  limitation: string;
}

export interface QualitativeEvidence {
  reviewId: string;
  source: string;
  evidenceSummary: string;
  evidenceType: 'direct' | 'inferred';
  categoryExpansionRelevance: 'direct_category_expansion' | 'indirect_category_expansion';
  whyItSupportsTheFinding: string;
}

export interface AffectedSegment {
  segmentName: string;
  observableSignals: string[];
  whyAffected: string;
}

export interface BehavioralChain {
  status: BehavioralChainStatus;
  evidenceType: BehavioralChainEvidenceType;
  trigger: string;
  userPerception: string;
  behavior: string;
  categoryExpansionConsequence: string;
}

export interface KeyFinding {
  rank: number;
  finding: string;
  observation: string;
  interpretation: string;
  interpretationType: EvidenceType;
  categoryExpansionRelevance: CategoryExpansionRelevance;
  affectedCategoryExpansionStage: ExpansionStage[];
  quantitativeEvidence: QuantitativeEvidence[];
  qualitativeEvidence: QualitativeEvidence[];
  affectedSegments: AffectedSegment[];
  behavioralChain: BehavioralChain;
  frequency: FrequencySeverity;
  severity: FrequencySeverity;
  productImplication: string;
  decisionEnabled: string;
  supportingReviewIds: string[];
  contradictingReviewIds: string[];
  limitations: string[];
  evidenceStrength: EvidenceStrength;
}

export interface CounterEvidence {
  observation: string;
  howItChangesTheConclusion: string;
  supportingReviewIds: string[];
}

export interface ExcludedIssue {
  issue: string;
  reasonExcluded: string;
  supportingReviewIds: string[];
}

export interface EligibilityConsideration {
  observation: string;
  implication: string;
  supportingReviewIds: string[];
}

export interface EvidenceGap {
  gap: string;
  whyItMatters: string;
  recommendedValidation: string;
}

export interface CategoryExpansionConnection {
  connection: string;
  affectedStage: ExpansionStage[];
  relevance: CategoryExpansionRelevance;
}

export interface Insight {
  id: string;
  questionId: number;
  question: string;
  answerStatus: AnswerStatus;
  directAnswer: string;
  categoryExpansionConnection: CategoryExpansionConnection;
  keyFindings: KeyFinding[];
  counterEvidence: CounterEvidence[];
  generalPlatformIssuesExcluded: ExcludedIssue[];
  categoryEligibilityConsiderations: EligibilityConsideration[];
  evidenceGaps: EvidenceGap[];
  allSupportingReviewIds: string[];
  evidenceStrengthScore: number;
  evidenceStrengthBand: EvidenceStrengthBand;
  evidenceStrengthDetail: EvidenceStrength;
  primaryCategoryExpansionRelevance: CategoryExpansionRelevance;
  createdAt: string;
}

export interface CrossQuestionPattern {
  pattern: string;
  relatedQuestionIds: number[];
  observation: string;
  interpretation: string;
  categoryExpansionRelevance: CategoryExpansionRelevance;
  affectedStage: ExpansionStage[];
  supportingReviewIds: string[];
  contradictingReviewIds: string[];
  evidenceStrengthScore: number;
  evidenceStrengthBand: EvidenceStrengthBand;
}

export interface BehavioralSegment {
  segmentName: string;
  segmentStatus: 'supported' | 'provisional' | 'insufficient_evidence';
  behavioralDefinition: string;
  definingSignals: string[];
  primaryJobOrContext: string;
  observedBehavior: string;
  mainCategoryExpansionBarriers: string[];
  mainCategoryExpansionTriggers: string[];
  categoryExplorationLikelihood: 'high' | 'medium' | 'low' | 'unknown';
  categoryEligibilityNotes: string;
  relevantQuestionIds: number[];
  supportingReviewIds: string[];
  contradictingReviewIds: string[];
  evidenceStrengthScore: number;
  limitations: string[];
}

export interface ResearchLimitation {
  limitation: string;
  impact: string;
  affectedQuestions: number[];
  recommendedValidation: string;
}

export interface InsightRun {
  id: string;
  sampleSize: number;
  totalReviewsConsidered: number;
  batchSummaries: unknown[];
  crossQuestionPatterns: CrossQuestionPattern[];
  behavioralSegments: BehavioralSegment[];
  researchLimitations: ResearchLimitation[];
  qualityChecks: Record<string, unknown>;
  createdAt: string;
}

export interface InsightsResponse {
  insights: Insight[];
  run: InsightRun | null;
}

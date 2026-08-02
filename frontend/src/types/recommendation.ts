import type { CategoryExpansionRelevance } from './insight';

export type RecommendationPriority = 'quick_win' | 'medium' | 'high' | 'long_term';

export interface SupportingFindingRef {
  questionId: number;
  findingRank: number;
}

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  title: string;
  description: string;
  categoryExpansionRelevance: CategoryExpansionRelevance;
  basedOnQuestionIds: number[];
  supportingFindingRefs: SupportingFindingRef[];
  supportingReviewIds: string[];
  createdAt: string;
}

export type RecommendationPriority = 'quick_win' | 'medium' | 'high' | 'long_term';

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  title: string;
  description: string;
  createdAt: string;
}

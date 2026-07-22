export interface Insight {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  supportingReviewIds: string[];
  createdAt: string;
}

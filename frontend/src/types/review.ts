export interface Review {
  id: string;
  review: string;
  rating?: number;
  source: string;
  username?: string;
  reviewDate?: string;
  language?: string;
  createdAt: string;
}

export interface ReviewAnalysis {
  id: string;
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
  createdAt: string;
}

export interface ReviewWithAnalysis extends Review {
  analysis?: ReviewAnalysis;
}

export interface ReviewsResponse {
  reviews: ReviewWithAnalysis[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ReviewFilters {
  source?: string[];
  sentiment?: string;
  theme?: string;
  emotion?: string;
  rating?: number;
  dateFrom?: string;
  dateTo?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

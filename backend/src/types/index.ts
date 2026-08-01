export type ReviewSource = 'reddit' | 'playstore' | 'appstore' | 'x' | 'community';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type Priority = 'quick_win' | 'medium' | 'high' | 'long_term';
export type PipelineStatus =
  | 'idle'
  | 'loading'
  | 'cleaning'
  | 'analyzing'
  | 'aggregating'
  | 'generating_insights'
  | 'completed'
  | 'error';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ReviewFilters {
  source?: ReviewSource;
  sentiment?: Sentiment;
  theme?: string;
  keyword?: string;
  rating?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface RawReview {
  review: string;
  rating?: number;
  username?: string;
  reviewDate?: string;
  source: ReviewSource;
}

export interface AnalysisResult {
  sentiment: Sentiment;
  emotion: string;
  themes: string[];
  painPoints: string[];
  shoppingHabit?: string;
  barrier?: string;
  experimentLikelihood?: string;
  featureRequests: string[];
  category?: string;
  summary: string;
  confidence: number;
}

export interface AggregationStats {
  totalCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  averageRating: number;
  sourceDistribution: Record<string, number>;
  themeFrequency: Record<string, number>;
  painPointFrequency: Record<string, number>;
  emotionFrequency: Record<string, number>;
  shoppingHabitDistribution: Record<string, number>;
  barrierDistribution: Record<string, number>;
  categoryFrequency: Record<string, number>;
}

export interface SourceProgress {
  source: string;
  label: string;
  status: 'pending' | 'connecting' | 'fetching' | 'done';
  count: number;
}

export interface StatusState {
  status: PipelineStatus;
  progress?: number;
  message?: string;
  sourceProgress?: SourceProgress[];
}

import api from './api';
import type { ReviewsResponse, ReviewFilters, ReviewWithAnalysis } from '../types/review';
import type { ApiResponse } from '../types/api';

interface RawReviewsResponse {
  reviews: ReviewWithAnalysis[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchReviews(filters: ReviewFilters = {}): Promise<ReviewsResponse> {
  const params: Record<string, string | number | string[]> = {};
  if (filters.source?.length) params.source = filters.source.join(',');
  if (filters.sentiment) params.sentiment = filters.sentiment;
  if (filters.theme) params.theme = filters.theme;
  if (filters.emotion) params.emotion = filters.emotion;
  if (filters.rating !== undefined) params.rating = filters.rating;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.keyword) params.keyword = filters.keyword;
  if (filters.page !== undefined) params.page = filters.page;
  if (filters.pageSize !== undefined) params.pageSize = filters.pageSize;

  const response = await api.get<ApiResponse<RawReviewsResponse>>('/api/reviews', { params });
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error ?? 'Failed to fetch reviews');
  }
  const { reviews, pagination } = response.data.data;
  return {
    reviews,
    total: pagination.total,
    page: pagination.page,
    pageSize: pagination.limit,
    totalPages: pagination.totalPages,
  };
}

export async function loadReviews(): Promise<{ message: string }> {
  const response = await api.get<ApiResponse<{ message: string }>>('/api/load-reviews');
  if (!response.data.success) {
    throw new Error(response.data.error ?? 'Failed to load reviews');
  }
  return response.data.data ?? { message: 'Reviews loaded' };
}

export async function analyzeReviews(): Promise<{ message: string }> {
  const response = await api.post<ApiResponse<{ message: string }>>('/api/analyze');
  if (!response.data.success) {
    throw new Error(response.data.error ?? 'Failed to start analysis');
  }
  return response.data.data ?? { message: 'Analysis started' };
}

export async function resetAnalysis(): Promise<{ message: string }> {
  const response = await api.post<ApiResponse<null>>('/api/reset-analysis');
  if (!response.data.success) {
    throw new Error(response.data.error ?? 'Failed to reset analysis');
  }
  return { message: response.data.message ?? 'Analysis reset' };
}

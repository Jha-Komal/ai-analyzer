import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReviews, loadReviews, analyzeReviews } from '../services/reviews';
import { QUERY_KEYS } from '../constants/queryKeys';
import type { ReviewFilters, ReviewsResponse } from '../types/review';

export function useReviews(filters: ReviewFilters = {}) {
  return useQuery<ReviewsResponse, Error>({
    queryKey: [...QUERY_KEYS.REVIEWS, filters],
    queryFn: () => fetchReviews(filters),
  });
}

export function useLoadReviews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loadReviews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATUS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS });
    },
  });
}

export function useAnalyzeReviews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: analyzeReviews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATUS });
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { fetchRecommendations } from '../services/recommendations';
import { QUERY_KEYS } from '../constants/queryKeys';
import type { Recommendation } from '../types/recommendation';

export function useRecommendations() {
  return useQuery<Recommendation[], Error>({
    queryKey: QUERY_KEYS.RECOMMENDATIONS,
    queryFn: fetchRecommendations,
  });
}

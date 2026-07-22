import { useQuery } from '@tanstack/react-query';
import { fetchInsights } from '../services/insights';
import { QUERY_KEYS } from '../constants/queryKeys';
import type { Insight } from '../types/insight';

export function useInsights() {
  return useQuery<Insight[], Error>({
    queryKey: QUERY_KEYS.INSIGHTS,
    queryFn: fetchInsights,
  });
}

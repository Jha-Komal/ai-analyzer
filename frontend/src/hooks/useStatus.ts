import { useQuery } from '@tanstack/react-query';
import { fetchStatus } from '../services/analysis';
import { QUERY_KEYS } from '../constants/queryKeys';
import type { StatusResponse } from '../types/analysis';

export function useStatus() {
  return useQuery<StatusResponse, Error>({
    queryKey: QUERY_KEYS.STATUS,
    queryFn: fetchStatus,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === 'idle' || status === 'completed') return false;
      return 3000;
    },
  });
}

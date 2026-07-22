import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../services/dashboard';
import { QUERY_KEYS } from '../constants/queryKeys';
import type { DashboardData } from '../types/dashboard';

export function useDashboard() {
  return useQuery<DashboardData | null, Error>({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: fetchDashboard,
  });
}

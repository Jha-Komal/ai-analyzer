import api from './api';
import type { DashboardData } from '../types/dashboard';
import type { ApiResponse } from '../types/api';

export async function fetchDashboard(): Promise<DashboardData | null> {
  const response = await api.get<ApiResponse<DashboardData>>('/api/dashboard');
  if (!response.data.success) {
    throw new Error(response.data.error ?? 'Failed to fetch dashboard data');
  }
  return response.data.data ?? null;
}

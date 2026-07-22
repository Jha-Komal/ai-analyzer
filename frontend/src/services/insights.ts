import api from './api';
import type { Insight } from '../types/insight';
import type { ApiResponse } from '../types/api';

export async function fetchInsights(): Promise<Insight[]> {
  const response = await api.get<ApiResponse<Insight[]>>('/api/insights');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error ?? 'Failed to fetch insights');
  }
  return response.data.data;
}

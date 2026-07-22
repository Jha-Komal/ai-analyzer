import api from './api';
import type { Recommendation } from '../types/recommendation';
import type { ApiResponse } from '../types/api';

export async function fetchRecommendations(): Promise<Recommendation[]> {
  const response = await api.get<ApiResponse<Recommendation[]>>('/api/recommendations');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error ?? 'Failed to fetch recommendations');
  }
  return response.data.data;
}

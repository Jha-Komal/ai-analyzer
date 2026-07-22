import api from './api';
import type { StatusResponse } from '../types/analysis';
import type { ApiResponse } from '../types/api';

export async function fetchStatus(): Promise<StatusResponse> {
  const response = await api.get<ApiResponse<StatusResponse>>('/api/status');
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error ?? 'Failed to fetch status');
  }
  return response.data.data;
}

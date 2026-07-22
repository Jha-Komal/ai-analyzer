import api from './api';
import type { ApiResponse } from '../types/api';

export async function fetchThemes(): Promise<string[]> {
  const response = await api.get<ApiResponse<string[]>>('/api/themes');
  if (!response.data.success || !response.data.data) {
    return [];
  }
  return response.data.data;
}

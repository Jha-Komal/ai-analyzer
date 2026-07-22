import { useQuery } from '@tanstack/react-query';
import { fetchThemes } from '../services/themes';
import { QUERY_KEYS } from '../constants/queryKeys';

export function useThemes() {
  return useQuery<string[], Error>({
    queryKey: QUERY_KEYS.THEMES,
    queryFn: fetchThemes,
  });
}

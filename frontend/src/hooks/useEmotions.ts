import { useDashboard } from './useDashboard';
import { toChartData } from '../utils/formatters';

export function useEmotions() {
  const { data, ...rest } = useDashboard();
  const emotions = data?.emotionDistribution
    ? toChartData(data.emotionDistribution)
    : [];
  return { data: emotions, ...rest };
}

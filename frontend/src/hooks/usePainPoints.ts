import { useDashboard } from './useDashboard';
import { toTopN } from '../utils/formatters';

export function usePainPoints(topN: number = 10) {
  const { data, ...rest } = useDashboard();
  const painPoints = data?.painPointDistribution
    ? toTopN(data.painPointDistribution, topN)
    : [];
  return { data: painPoints, ...rest };
}

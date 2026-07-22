import { useDashboard } from './useDashboard';
import { toChartData } from '../utils/formatters';

export function useCategories() {
  const { data, ...rest } = useDashboard();
  const categories = data?.categoryDistribution
    ? toChartData(data.categoryDistribution)
    : [];
  return { data: categories, ...rest };
}

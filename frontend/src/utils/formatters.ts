export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatRating(rating: number | undefined): string {
  if (rating === undefined || rating === null) return '—';
  return rating.toFixed(1);
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

export function truncateText(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatPipelineStatus(status: string): string {
  const map: Record<string, string> = {
    idle: 'Idle',
    loading: 'Loading Reviews',
    cleaning: 'Cleaning Reviews',
    analyzing: 'Analyzing Reviews',
    aggregating: 'Generating Statistics',
    generating_insights: 'Generating Insights',
    completed: 'Completed',
  };
  return map[status] ?? status;
}

export function toChartData(
  distribution: Record<string, number>
): Array<{ name: string; value: number }> {
  return Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function toTopN(
  distribution: Record<string, number>,
  n: number = 10
): Array<{ name: string; value: number }> {
  return toChartData(distribution).slice(0, n);
}

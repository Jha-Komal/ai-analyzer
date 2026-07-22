export const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#22c55e',   // green-500
  neutral: '#eab308',    // yellow-500
  negative: '#ef4444',   // red-500
};

export const SOURCE_COLORS: Record<string, string> = {
  reddit: '#f97316',     // orange-500
  playstore: '#3b82f6',  // blue-500
  appstore: '#6b7280',   // gray-500
  x: '#38bdf8',          // sky-400
  community: '#a855f7',  // purple-500
};

export const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#f97316',
  '#06b6d4',
];

export function getSentimentColor(sentiment: string): string {
  return SENTIMENT_COLORS[sentiment?.toLowerCase()] ?? '#6b7280';
}

export function getSourceColor(source: string): string {
  return SOURCE_COLORS[source?.toLowerCase()] ?? '#6b7280';
}

export function getSentimentBgClass(sentiment: string): string {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'neutral':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'negative':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
}

export function getSourceBgClass(source: string): string {
  switch (source?.toLowerCase()) {
    case 'reddit':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case 'playstore':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'appstore':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    case 'x':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400';
    case 'community':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
}

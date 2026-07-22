import { getSentimentBgClass } from '../../utils/colors';
import { capitalize } from '../../utils/formatters';
import { cn } from '../../lib/utils';

interface SentimentBadgeProps {
  sentiment: string;
  className?: string;
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold',
        getSentimentBgClass(sentiment),
        className
      )}
    >
      {capitalize(sentiment)}
    </span>
  );
}

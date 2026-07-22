import { getSourceBgClass } from '../../utils/colors';
import { capitalize } from '../../utils/formatters';
import { cn } from '../../lib/utils';

interface SourceBadgeProps {
  source: string;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold',
        getSourceBgClass(source),
        className
      )}
    >
      {capitalize(source)}
    </span>
  );
}

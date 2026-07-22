import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

interface ConfidenceBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function ConfidenceBar({ value, className, showLabel = true }: ConfidenceBarProps) {
  const percent = Math.round(value * 100);
  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-medium text-foreground">{percent}%</span>
        </div>
      )}
      <Progress value={percent} className="h-2" />
    </div>
  );
}

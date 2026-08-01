import { CheckIcon, LoaderIcon } from 'lucide-react';
import type { PipelineStatus } from '../../types/analysis';
import { cn } from '../../lib/utils';

const STAGES: { status: PipelineStatus; label: string }[] = [
  { status: 'ingesting', label: 'Collecting Live Data' },
  { status: 'loading',   label: 'Loading Reviews' },
  { status: 'cleaning',  label: 'Cleaning Reviews' },
  { status: 'analyzing', label: 'Analyzing Reviews' },
  { status: 'aggregating', label: 'Generating Statistics' },
  { status: 'generating_insights', label: 'Generating Insights' },
  { status: 'completed', label: 'Completed' },
];

const STATUS_ORDER: Record<PipelineStatus, number> = {
  idle: -1,
  error: -1,
  ingesting: 0,
  loading: 1,
  cleaning: 2,
  analyzing: 3,
  aggregating: 4,
  generating_insights: 5,
  completed: 6,
};

interface ProgressIndicatorProps {
  currentStatus: PipelineStatus;
  className?: string;
}

export function ProgressIndicator({ currentStatus, className }: ProgressIndicatorProps) {
  const currentIndex = STATUS_ORDER[currentStatus];

  return (
    <div className={cn('w-full max-w-2xl mx-auto py-8 px-4', className)}>
      <h2 className="text-xl font-semibold text-center mb-8 text-foreground">
        Processing your reviews…
      </h2>
      <ol className="space-y-3">
        {STAGES.map((stage, idx) => {
          const stageIndex = STATUS_ORDER[stage.status];
          const isDone = currentIndex > stageIndex;
          const isActive = currentIndex === stageIndex;
          const isPending = currentIndex < stageIndex;

          return (
            <li key={stage.status} className="flex items-center gap-4">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  isDone && 'border-green-500 bg-green-500 text-white',
                  isActive && 'border-primary bg-primary/10 text-primary',
                  isPending && 'border-muted bg-muted text-muted-foreground'
                )}
              >
                {isDone ? (
                  <CheckIcon className="h-4 w-4" />
                ) : isActive ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-xs font-medium">{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  isDone && 'text-green-600 dark:text-green-400',
                  isActive && 'text-primary',
                  isPending && 'text-muted-foreground'
                )}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

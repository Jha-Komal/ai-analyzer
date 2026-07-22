import { AlertCircleIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <AlertCircleIcon className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {message && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      )}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}

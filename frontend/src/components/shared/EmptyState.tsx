import { InboxIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, className, action }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="mb-4 rounded-full bg-muted p-4">
        <InboxIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

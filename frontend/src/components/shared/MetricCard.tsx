import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p
                className={cn(
                  'text-xs',
                  trend.value >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {trend.value >= 0 ? '+' : ''}
                {trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className={cn('rounded-lg bg-muted p-2', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

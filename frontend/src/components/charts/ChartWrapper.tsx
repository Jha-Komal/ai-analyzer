import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { cn } from '../../lib/utils';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartWrapper({ title, subtitle, children, className }: ChartWrapperProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-1 pt-4 px-4">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {subtitle && <CardDescription className="text-xs">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">{children}</CardContent>
    </Card>
  );
}

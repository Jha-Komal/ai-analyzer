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
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

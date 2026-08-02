import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';
import type { EvidenceStrengthBand } from '../../types/insight';

const BAND_VARIANT: Record<EvidenceStrengthBand, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  high: 'default',
  medium: 'secondary',
  low: 'outline',
  insufficient: 'destructive',
};

const BAND_LABEL: Record<EvidenceStrengthBand, string> = {
  high: 'High evidence',
  medium: 'Medium evidence',
  low: 'Low evidence',
  insufficient: 'Insufficient evidence',
};

export function EvidenceStrengthBadge({ band }: { band: EvidenceStrengthBand }) {
  return <Badge variant={BAND_VARIANT[band]}>{BAND_LABEL[band]}</Badge>;
}

interface EvidenceStrengthBarProps {
  score: number;
  band: EvidenceStrengthBand;
  className?: string;
}

export function EvidenceStrengthBar({ score, band, className }: EvidenceStrengthBarProps) {
  const percent = Math.round(score * 100);
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Evidence strength ({BAND_LABEL[band].toLowerCase()})</span>
        <span className="font-medium text-foreground">{percent}%</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}

import { Badge } from '../ui/badge';
import type { AnswerStatus } from '../../types/insight';

const STATUS_VARIANT: Record<AnswerStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  supported: 'default',
  partially_supported: 'secondary',
  insufficient_evidence: 'destructive',
};

const STATUS_LABEL: Record<AnswerStatus, string> = {
  supported: 'Supported',
  partially_supported: 'Partially supported',
  insufficient_evidence: 'Insufficient evidence',
};

export function AnswerStatusBadge({ status }: { status: AnswerStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

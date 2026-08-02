import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader } from '../ui/card';
import type { BehavioralSegment } from '../../types/insight';

const STATUS_LABEL: Record<string, string> = {
  supported: 'Supported',
  provisional: 'Provisional',
  insufficient_evidence: 'Insufficient evidence',
};

function SegmentCard({ segment }: { segment: BehavioralSegment }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground">{segment.segmentName}</h4>
          <Badge variant={segment.segmentStatus === 'supported' ? 'default' : 'secondary'} className="text-xs">
            {STATUS_LABEL[segment.segmentStatus] ?? segment.segmentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {segment.behavioralDefinition && (
          <p className="text-sm text-muted-foreground">{segment.behavioralDefinition}</p>
        )}
        {segment.mainCategoryExpansionTriggers.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Triggers</p>
            <div className="flex flex-wrap gap-1.5">
              {segment.mainCategoryExpansionTriggers.map((t, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {segment.mainCategoryExpansionBarriers.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Barriers</p>
            <div className="flex flex-wrap gap-1.5">
              {segment.mainCategoryExpansionBarriers.map((b, i) => (
                <Badge key={i} variant="destructive" className="text-xs">
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Category-exploration likelihood: <span className="font-medium text-foreground">{segment.categoryExplorationLikelihood}</span>
          {' · '}
          {segment.supportingReviewIds.length} supporting review{segment.supportingReviewIds.length !== 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  );
}

export function BehavioralSegmentsSection({ segments }: { segments: BehavioralSegment[] }) {
  if (segments.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Behavioural segments</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {segments.map((s, i) => (
          <SegmentCard key={i} segment={s} />
        ))}
      </div>
    </section>
  );
}

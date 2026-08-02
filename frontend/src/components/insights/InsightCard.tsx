import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { AnswerStatusBadge } from './AnswerStatusBadge';
import { CategoryExpansionBadge } from './CategoryExpansionBadge';
import { EvidenceStrengthBar } from './EvidenceStrength';
import type { Insight } from '../../types/insight';

interface InsightCardProps {
  insight: Insight;
  onViewDetail: (insight: Insight) => void;
}

export function InsightCard({ insight, onViewDetail }: InsightCardProps) {
  const topFinding = [...insight.keyFindings].sort((a, b) => a.rank - b.rank)[0];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground leading-snug">{insight.question}</h3>
          <AnswerStatusBadge status={insight.answerStatus} />
        </div>
        <CategoryExpansionBadge relevance={insight.primaryCategoryExpansionRelevance} />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-base text-muted-foreground leading-relaxed">{insight.directAnswer}</p>

        {topFinding && (
          <div className="rounded-md border border-border/50 bg-muted/30 p-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Top finding</p>
            <p className="text-sm text-foreground">{topFinding.finding}</p>
          </div>
        )}

        <EvidenceStrengthBar score={insight.evidenceStrengthScore} band={insight.evidenceStrengthBand} />

        <Button variant="outline" className="w-full" onClick={() => onViewDetail(insight)}>
          View full analysis ({insight.keyFindings.length} finding{insight.keyFindings.length !== 1 ? 's' : ''})
        </Button>
      </CardContent>
    </Card>
  );
}

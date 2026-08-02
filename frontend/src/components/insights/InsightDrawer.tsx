import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { AnswerStatusBadge } from './AnswerStatusBadge';
import { CategoryExpansionBadge } from './CategoryExpansionBadge';
import { FindingCard } from './FindingCard';
import type { Insight } from '../../types/insight';

interface InsightDrawerProps {
  insight: Insight | null;
  open: boolean;
  onClose: () => void;
}

export function InsightDrawer({ insight, open, onClose }: InsightDrawerProps) {
  if (!insight) return null;
  const sortedFindings = [...insight.keyFindings].sort((a, b) => a.rank - b.rank);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{insight.question}</SheetTitle>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <AnswerStatusBadge status={insight.answerStatus} />
            <CategoryExpansionBadge relevance={insight.primaryCategoryExpansionRelevance} />
          </div>
        </SheetHeader>

        <section className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Direct answer</h4>
          <p className="text-sm text-foreground leading-relaxed">{insight.directAnswer}</p>
        </section>

        {insight.categoryExpansionConnection.connection && (
          <section className="mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Category-expansion connection
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{insight.categoryExpansionConnection.connection}</p>
            {insight.categoryExpansionConnection.affectedStage.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {insight.categoryExpansionConnection.affectedStage.map((stage) => (
                  <Badge key={stage} variant="outline" className="text-xs">
                    {stage.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </section>
        )}

        <Separator className="my-4" />

        <section className="mb-5 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Key findings ({sortedFindings.length})
          </h4>
          {sortedFindings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No findings survived validation for this question.</p>
          ) : (
            sortedFindings.map((f, i) => <FindingCard key={i} finding={f} />)
          )}
        </section>

        {insight.counterEvidence.length > 0 && (
          <>
            <Separator className="my-4" />
            <section className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Counter-evidence
              </h4>
              <ul className="space-y-2">
                {insight.counterEvidence.map((ce, i) => (
                  <li key={i} className="text-sm text-foreground rounded-md border border-border/50 bg-muted/20 p-2.5">
                    <p>{ce.observation}</p>
                    {ce.howItChangesTheConclusion && (
                      <p className="text-muted-foreground text-xs mt-1">{ce.howItChangesTheConclusion}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {insight.categoryEligibilityConsiderations.length > 0 && (
          <>
            <Separator className="my-4" />
            <section className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Category eligibility considerations
              </h4>
              <ul className="space-y-2">
                {insight.categoryEligibilityConsiderations.map((c, i) => (
                  <li key={i} className="text-sm text-foreground rounded-md border border-border/50 bg-muted/20 p-2.5">
                    <p>{c.observation}</p>
                    {c.implication && <p className="text-muted-foreground text-xs mt-1">{c.implication}</p>}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {insight.generalPlatformIssuesExcluded.length > 0 && (
          <>
            <Separator className="my-4" />
            <section className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                General platform issues excluded from this analysis
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {insight.generalPlatformIssuesExcluded.map((e, i) => (
                  <li key={i}>{e.issue}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {insight.evidenceGaps.length > 0 && (
          <>
            <Separator className="my-4" />
            <section className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Evidence gaps
              </h4>
              <ul className="space-y-2">
                {insight.evidenceGaps.map((g, i) => (
                  <li key={i} className="text-sm text-foreground rounded-md border border-border/50 bg-muted/20 p-2.5">
                    <p className="font-medium">{g.gap}</p>
                    {g.recommendedValidation && (
                      <p className="text-muted-foreground text-xs mt-1">Next: {g.recommendedValidation}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

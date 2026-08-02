import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { CategoryExpansionBadge } from './CategoryExpansionBadge';
import { EvidenceStrengthBadge } from './EvidenceStrength';
import type { KeyFinding } from '../../types/insight';

const EVIDENCE_TYPE_LABEL: Record<string, string> = {
  direct: 'Direct',
  inferred: 'Inferred',
  insufficient_evidence: 'Insufficient evidence',
  partially_inferred: 'Partially inferred',
};

function FrequencySeverityBadge({ label, value }: { label: string; value: string }) {
  if (value === 'unknown') return null;
  return (
    <Badge variant="outline" className="text-xs">
      {label}: {value}
    </Badge>
  );
}

export function FindingCard({ finding }: { finding: KeyFinding }) {
  const hasChain =
    finding.behavioralChain.status !== 'insufficient_evidence' &&
    (finding.behavioralChain.trigger || finding.behavioralChain.behavior);

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">#{finding.rank}</span>
          <h5 className="text-sm font-semibold text-foreground">{finding.finding}</h5>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryExpansionBadge relevance={finding.categoryExpansionRelevance} />
          <EvidenceStrengthBadge band={finding.evidenceStrength.evidenceStrengthBand} />
        </div>
      </div>

      {(finding.observation || finding.interpretation) && (
        <div className="space-y-1.5 text-sm">
          {finding.observation && (
            <p>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-1.5">
                Observation
              </span>
              <span className="text-foreground">{finding.observation}</span>
            </p>
          )}
          {finding.interpretation && (
            <p>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-1.5">
                Interpretation ({EVIDENCE_TYPE_LABEL[finding.interpretationType] ?? finding.interpretationType})
              </span>
              <span className="text-foreground">{finding.interpretation}</span>
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        <FrequencySeverityBadge label="Frequency" value={finding.frequency} />
        <FrequencySeverityBadge label="Severity" value={finding.severity} />
        {finding.affectedCategoryExpansionStage.map((stage) => (
          <Badge key={stage} variant="outline" className="text-xs">
            {stage.replace(/_/g, ' ')}
          </Badge>
        ))}
      </div>

      {finding.productImplication && (
        <p className="text-sm text-foreground">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mr-1.5">
            Product implication
          </span>
          {finding.productImplication}
        </p>
      )}

      {finding.affectedSegments.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {finding.affectedSegments.map((s, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {s.segmentName}
            </Badge>
          ))}
        </div>
      )}

      {hasChain && (
        <div className="rounded-md border border-border/50 bg-background/60 p-2.5 text-xs space-y-1">
          <span className="font-semibold uppercase tracking-wide text-muted-foreground">
            Behavioural chain ({EVIDENCE_TYPE_LABEL[finding.behavioralChain.evidenceType] ?? finding.behavioralChain.evidenceType})
          </span>
          <p className="text-foreground">
            {finding.behavioralChain.trigger} → {finding.behavioralChain.userPerception} → {finding.behavioralChain.behavior} →{' '}
            {finding.behavioralChain.categoryExpansionConsequence}
          </p>
        </div>
      )}

      {(finding.quantitativeEvidence.length > 0 || finding.qualitativeEvidence.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {finding.quantitativeEvidence.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold uppercase tracking-wide text-muted-foreground">Quantitative evidence</span>
              <ul className="space-y-1">
                {finding.quantitativeEvidence.map((qe, i) => (
                  <li key={i} className="text-foreground">
                    {qe.metric}: <span className="font-medium">{qe.value}</span>
                    {qe.interpretation && <span className="text-muted-foreground"> — {qe.interpretation}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {finding.qualitativeEvidence.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold uppercase tracking-wide text-muted-foreground">Qualitative evidence</span>
              <ul className="space-y-1">
                {finding.qualitativeEvidence.map((qe, i) => (
                  <li key={i} className="text-foreground">
                    <span className="text-muted-foreground">[{qe.source || 'review'}]</span> {qe.evidenceSummary}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{finding.supportingReviewIds.length} supporting review{finding.supportingReviewIds.length !== 1 ? 's' : ''}</span>
        {finding.contradictingReviewIds.length > 0 && (
          <span>{finding.contradictingReviewIds.length} contradicting review{finding.contradictingReviewIds.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <Separator />

      <div className="space-y-1">
        <div className="grid grid-cols-5 gap-1 text-[10px] text-muted-foreground text-center">
          <span>Volume</span>
          <span>Relevance</span>
          <span>Sources</span>
          <span>Consistency</span>
          <span>Quality</span>
        </div>
        <div className="grid grid-cols-5 gap-1 text-xs font-medium text-foreground text-center">
          <span>{finding.evidenceStrength.evidenceVolumeScore}</span>
          <span>{finding.evidenceStrength.evidenceRelevanceScore}</span>
          <span>{finding.evidenceStrength.sourceDiversityScore}</span>
          <span>{finding.evidenceStrength.consistencyScore}</span>
          <span>{finding.evidenceStrength.evidenceQualityScore}</span>
        </div>
        {finding.evidenceStrength.scoreReason && (
          <p className="text-xs text-muted-foreground italic pt-1">{finding.evidenceStrength.scoreReason}</p>
        )}
      </div>

      {finding.limitations.length > 0 && (
        <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
          {finding.limitations.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

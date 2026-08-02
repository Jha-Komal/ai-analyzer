import { useState } from 'react';
import { LightbulbIcon } from 'lucide-react';
import { Loader } from '../components/shared/Loader';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { InsightCard } from '../components/insights/InsightCard';
import { InsightDrawer } from '../components/insights/InsightDrawer';
import { BehavioralSegmentsSection } from '../components/insights/BehavioralSegmentsSection';
import { SimpleListSection, type SimpleListItem } from '../components/insights/SimpleListSection';
import { useInsights } from '../hooks/useInsights';
import type { Insight } from '../types/insight';

export function InsightsPage() {
  const { data, isLoading, error, refetch } = useInsights();
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size="lg" text="Loading insights…" />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load insights" message={error.message} onRetry={() => refetch()} />;
  }

  if (!data || data.insights.length === 0) {
    return (
      <EmptyState
        title="No insights yet"
        description="Run an analysis to generate AI-powered insights from your reviews."
        action={
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            Go to the Dashboard and click "Analyze Reviews"
          </div>
        }
      />
    );
  }

  const { insights, run } = data;

  const patternItems: SimpleListItem[] = (run?.crossQuestionPatterns ?? []).map((p) => ({
    title: p.pattern,
    subtitle: p.interpretation || p.observation,
    badge: p.evidenceStrengthBand,
  }));

  const limitationItems: SimpleListItem[] = (run?.researchLimitations ?? []).map((l) => ({
    title: l.limitation,
    subtitle: l.impact,
    badge: l.affectedQuestions.length > 0 ? `Q${l.affectedQuestions.join(', Q')}` : undefined,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <LightbulbIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">AI-Generated Insights</h2>
          <p className="text-base text-muted-foreground">
            {insights.length} insight{insights.length !== 1 ? 's' : ''} from your review data
          </p>
        </div>
      </div>

      {run && (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-muted-foreground">
          Based on a stratified sample of <span className="font-medium text-foreground">{run.sampleSize}</span> of{' '}
          <span className="font-medium text-foreground">{run.totalReviewsConsidered}</span> analyzed reviews, drawn
          proportionally across source and sentiment.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} onViewDetail={setSelectedInsight} />
        ))}
      </div>

      <BehavioralSegmentsSection segments={run?.behavioralSegments ?? []} />
      <SimpleListSection heading="Patterns across questions" items={patternItems} />
      <SimpleListSection heading="Research limitations" items={limitationItems} />

      <InsightDrawer insight={selectedInsight} open={selectedInsight !== null} onClose={() => setSelectedInsight(null)} />
    </div>
  );
}

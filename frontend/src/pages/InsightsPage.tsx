import { LightbulbIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ConfidenceBar } from '../components/shared/ConfidenceBar';
import { Loader } from '../components/shared/Loader';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { useInsights } from '../hooks/useInsights';

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
  if (pct >= 80) variant = 'default';
  else if (pct < 50) variant = 'destructive';
  return <Badge variant={variant}>{pct}% confidence</Badge>;
}

export function InsightsPage() {
  const { data, isLoading, error, refetch } = useInsights();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size="lg" text="Loading insights…" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load insights"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <LightbulbIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI-Generated Insights</h2>
          <p className="text-sm text-muted-foreground">
            {data.length} insight{data.length !== 1 ? 's' : ''} from your review data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {data.map((insight) => (
          <Card key={insight.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground leading-snug">
                  {insight.question}
                </h3>
                <ConfidenceBadge value={insight.confidence} />
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.answer}
              </p>
              <ConfidenceBar value={insight.confidence} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

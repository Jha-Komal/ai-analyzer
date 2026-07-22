import { ZapIcon, TrendingUpIcon, AlertTriangleIcon, ClockIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Loader } from '../components/shared/Loader';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { useRecommendations } from '../hooks/useRecommendations';
import type { Recommendation, RecommendationPriority } from '../types/recommendation';
import { cn } from '../lib/utils';

const PRIORITY_CONFIG: Record<
  RecommendationPriority,
  { label: string; icon: React.ElementType; color: string; badge: string }
> = {
  quick_win: {
    label: 'Quick Wins',
    icon: ZapIcon,
    color: 'border-l-green-500',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  medium: {
    label: 'Medium Priority',
    icon: TrendingUpIcon,
    color: 'border-l-blue-500',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  high: {
    label: 'High Priority',
    icon: AlertTriangleIcon,
    color: 'border-l-red-500',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  long_term: {
    label: 'Long-Term Opportunities',
    icon: ClockIcon,
    color: 'border-l-purple-500',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
};

const PRIORITY_ORDER: RecommendationPriority[] = ['quick_win', 'high', 'medium', 'long_term'];

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const cfg = PRIORITY_CONFIG[rec.priority];
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 border-l-4',
        cfg.color
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-semibold text-foreground">{rec.title}</h4>
        <span className={cn('inline-flex rounded-md px-2 py-0.5 text-xs font-semibold shrink-0', cfg.badge)}>
          {cfg.label}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
    </div>
  );
}

export function RecommendationsPage() {
  const { data, isLoading, error, refetch } = useRecommendations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size="lg" text="Loading recommendations…" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load recommendations"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No recommendations yet"
        description="Run an analysis to generate AI-powered recommendations from your reviews."
      />
    );
  }

  const grouped = PRIORITY_ORDER.reduce<Record<RecommendationPriority, Recommendation[]>>(
    (acc, p) => {
      acc[p] = data.filter((r) => r.priority === p);
      return acc;
    },
    { quick_win: [], medium: [], high: [], long_term: [] }
  );

  return (
    <div className="space-y-8">
      {PRIORITY_ORDER.map((priority) => {
        const recs = grouped[priority];
        if (recs.length === 0) return null;
        const cfg = PRIORITY_CONFIG[priority];
        const Icon = cfg.icon;
        return (
          <section key={priority}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('rounded-lg p-2 bg-muted')}>
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">{cfg.label}</h2>
                <p className="text-sm text-muted-foreground">
                  {recs.length} recommendation{recs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {recs.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

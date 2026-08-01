import { ZapIcon, TrendingUpIcon, AlertTriangleIcon, ClockIcon } from 'lucide-react';
import { Loader } from '../components/shared/Loader';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { useRecommendations } from '../hooks/useRecommendations';
import type { Recommendation, RecommendationPriority } from '../types/recommendation';
import { cn } from '../lib/utils';

const PRIORITY_CONFIG: Record<
  RecommendationPriority,
  {
    label: string;
    icon: React.ElementType;
    topBorder: string;
    iconClass: string;
    labelClass: string;
    glow: string;
  }
> = {
  quick_win: {
    label: 'Quick Win',
    icon: ZapIcon,
    topBorder: 'border-t-emerald-400',
    iconClass: 'bg-emerald-400/10 text-emerald-400',
    labelClass: 'text-emerald-400',
    glow: 'hover:shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_8px_40px_rgba(52,211,153,0.12)]',
  },
  high: {
    label: 'High Priority',
    icon: AlertTriangleIcon,
    topBorder: 'border-t-rose-400',
    iconClass: 'bg-rose-400/10 text-rose-400',
    labelClass: 'text-rose-400',
    glow: 'hover:shadow-[0_0_0_1px_rgba(251,113,133,0.15),0_8px_40px_rgba(251,113,133,0.12)]',
  },
  medium: {
    label: 'Medium Priority',
    icon: TrendingUpIcon,
    topBorder: 'border-t-sky-400',
    iconClass: 'bg-sky-400/10 text-sky-400',
    labelClass: 'text-sky-400',
    glow: 'hover:shadow-[0_0_0_1px_rgba(56,189,248,0.15),0_8px_40px_rgba(56,189,248,0.12)]',
  },
  long_term: {
    label: 'Long-Term',
    icon: ClockIcon,
    topBorder: 'border-t-violet-400',
    iconClass: 'bg-violet-400/10 text-violet-400',
    labelClass: 'text-violet-400',
    glow: 'hover:shadow-[0_0_0_1px_rgba(167,139,250,0.15),0_8px_40px_rgba(167,139,250,0.12)]',
  },
};

const PRIORITY_ORDER: RecommendationPriority[] = ['quick_win', 'high', 'medium', 'long_term'];

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const cfg = PRIORITY_CONFIG[rec.priority];
  const Icon = cfg.icon;
  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl border-t-2 border border-border/50 bg-card p-5 overflow-hidden',
        'shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-all duration-300',
        cfg.topBorder,
        cfg.glow,
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn('rounded-xl p-2.5', cfg.iconClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn('text-sm font-semibold tracking-wide uppercase', cfg.labelClass)}>
          {cfg.label}
        </span>
      </div>
      <div className="space-y-2">
        <h4 className="text-base font-bold text-foreground leading-snug">{rec.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
      </div>
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
    <div className="space-y-10">
      {PRIORITY_ORDER.map((priority) => {
        const recs = grouped[priority];
        if (recs.length === 0) return null;
        const cfg = PRIORITY_CONFIG[priority];
        const Icon = cfg.icon;
        return (
          <section key={priority}>
            <div className="flex items-center gap-3 mb-5">
              <div className={cn('rounded-xl p-2', cfg.iconClass)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg font-bold text-foreground">{cfg.label}</h2>
                <span className="text-sm text-muted-foreground">
                  {recs.length} item{recs.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {recs.map((rec) => (
                <div key={rec.id} className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(33.333%-11px)]">
                  <RecommendationCard rec={rec} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

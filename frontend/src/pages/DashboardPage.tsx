import {
  MessageSquareIcon,
  SmileIcon,
  MinusCircleIcon,
  FrownIcon,
  StarIcon,
  ZapIcon,
  RotateCcwIcon,
  LightbulbIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { MetricCard } from '../components/shared/MetricCard';
import { ProgressIndicator } from '../components/shared/ProgressIndicator';
import { LiveSourcesPanel } from '../components/shared/LiveSourcesPanel';
import { Loader } from '../components/shared/Loader';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { SentimentPieChart } from '../components/charts/SentimentPieChart';
import { SourcePieChart } from '../components/charts/SourcePieChart';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { ThemeBarChart } from '../components/charts/ThemeBarChart';
import { PainPointBarChart } from '../components/charts/PainPointBarChart';
import { EmotionBarChart } from '../components/charts/EmotionBarChart';
import { ShoppingHabitChart } from '../components/charts/ShoppingHabitChart';
import { BarrierChart } from '../components/charts/BarrierChart';
import { TrendChart } from '../components/charts/TrendChart';
import { useDashboard } from '../hooks/useDashboard';
import { useStatus } from '../hooks/useStatus';
import { useAnalyzeReviews, useResetAnalysis } from '../hooks/useReviews';
import { isBetaEnabled } from '../lib/betaFlag';

export function DashboardPage() {
  const { data: dashboard, isLoading: dashLoading, error: dashError, refetch } = useDashboard();
  const { data: statusData } = useStatus();
  const analyzeReviews = useAnalyzeReviews();
  const navigate = useNavigate();
  const resetAnalysis = useResetAnalysis();

  const status = statusData?.status ?? 'idle';
  const isPipelineRunning = status !== 'idle' && status !== 'completed' && status !== 'error';
  const hasPipelineError = status === 'error';
  const betaEnabled = isBetaEnabled();

  async function handleAnalyze() {
    await analyzeReviews.mutateAsync();
  }

  async function handleResetAnalysis() {
    const confirmed = window.confirm(
      'This permanently deletes all analysis, insights, and recommendations so every review can be re-analyzed from scratch. Continue?'
    );
    if (!confirmed) return;
    await resetAnalysis.mutateAsync();
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <p className="text-base text-muted-foreground">
          Manage and analyze your customer reviews
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/insights')}>
            <LightbulbIcon className="h-4 w-4" />
            View Insights
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={analyzeReviews.isPending || isPipelineRunning}
          >
            {analyzeReviews.isPending ? (
              <>
                <ZapIcon className="h-4 w-4 animate-pulse" />
                Starting…
              </>
            ) : (
              <>
                <ZapIcon className="h-4 w-4" />
                Analyze Reviews
              </>
            )}
          </Button>
          {betaEnabled && (
            <Button
              variant="outline"
              onClick={handleResetAnalysis}
              disabled={resetAnalysis.isPending || isPipelineRunning}
            >
              {resetAnalysis.isPending ? (
                <>
                  <RotateCcwIcon className="h-4 w-4 animate-spin" />
                  Resetting…
                </>
              ) : (
                <>
                  <RotateCcwIcon className="h-4 w-4" />
                  Reset Analysis (Beta)
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Pipeline error banner */}
      {hasPipelineError && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="font-semibold">Pipeline error:</span>
          <span className="text-destructive/80">{statusData?.message ?? 'Something went wrong. Try running again.'}</span>
        </div>
      )}

      {/* Progress screen */}
      {isPipelineRunning && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-border bg-card">
            <ProgressIndicator currentStatus={status} />
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <LiveSourcesPanel sourceProgress={statusData?.sourceProgress} />
          </div>
        </div>
      )}

      {/* Dashboard content */}
      {dashLoading && !isPipelineRunning && (
        <div className="flex items-center justify-center py-24">
          <Loader size="lg" text="Loading dashboard…" />
        </div>
      )}

      {dashError && !dashLoading && (
        <ErrorState
          title="Failed to load dashboard"
          message={dashError.message}
          onRetry={() => refetch()}
        />
      )}

      {!dashLoading && !dashError && !dashboard && (
        <EmptyState
          title="No data yet"
          description="Load and analyze reviews to see your dashboard."
        />
      )}

      {dashboard && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            <MetricCard
              label="Total Reviews"
              value={dashboard.totalCount.toLocaleString()}
              icon={MessageSquareIcon}
              iconColor="text-blue-500"
            />
            <MetricCard
              label="Positive"
              value={dashboard.positiveCount.toLocaleString()}
              icon={SmileIcon}
              iconColor="text-green-500"
            />
            <MetricCard
              label="Neutral"
              value={dashboard.neutralCount.toLocaleString()}
              icon={MinusCircleIcon}
              iconColor="text-yellow-500"
            />
            <MetricCard
              label="Negative"
              value={dashboard.negativeCount.toLocaleString()}
              icon={FrownIcon}
              iconColor="text-red-500"
            />
            <MetricCard
              label="Avg Rating"
              value={dashboard.averageRating?.toFixed(1) ?? '—'}
              icon={StarIcon}
              iconColor="text-amber-500"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SentimentPieChart data={dashboard} />
            <SourcePieChart data={dashboard} />
            {Object.keys(dashboard.emotionDistribution ?? {}).length > 0 && (
              <EmotionBarChart distribution={dashboard.emotionDistribution} />
            )}
            {Object.keys(dashboard.categoryDistribution ?? {}).length > 0 && (
              <CategoryBarChart distribution={dashboard.categoryDistribution} />
            )}
            {Object.keys(dashboard.themeDistribution ?? {}).length > 0 && (
              <ThemeBarChart distribution={dashboard.themeDistribution} />
            )}
            {Object.keys(dashboard.painPointDistribution ?? {}).length > 0 && (
              <PainPointBarChart distribution={dashboard.painPointDistribution} />
            )}
            {Object.keys(dashboard.shoppingHabitDistribution ?? {}).length > 0 && (
              <ShoppingHabitChart distribution={dashboard.shoppingHabitDistribution!} />
            )}
            {Object.keys(dashboard.barrierDistribution ?? {}).length > 0 && (
              <BarrierChart distribution={dashboard.barrierDistribution!} />
            )}
            {(dashboard.sentimentTrend?.length ?? 0) > 1 && (
              <TrendChart data={dashboard.sentimentTrend!} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

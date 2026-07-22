import { useState } from 'react';
import { FilterPanel } from '../components/shared/FilterPanel';
import { ReviewTable } from '../components/shared/ReviewTable';
import { Loader } from '../components/shared/Loader';
import { ErrorState } from '../components/shared/ErrorState';
import { EmptyState } from '../components/shared/EmptyState';
import { useReviews } from '../hooks/useReviews';
import type { ReviewFilters } from '../types/review';
import { SlidersHorizontalIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const DEFAULT_PAGE_SIZE = 20;

export function ReviewsPage() {
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [showFilters, setShowFilters] = useState(true);

  const { data, isLoading, error, refetch } = useReviews(filters);

  function handlePageChange(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  function handleFiltersChange(newFilters: ReviewFilters) {
    setFilters({ ...newFilters, pageSize: DEFAULT_PAGE_SIZE });
  }

  return (
    <div className="flex gap-6 min-h-full">
      {/* Filter sidebar */}
      <aside
        className={cn(
          'w-64 shrink-0 transition-all duration-200',
          showFilters ? 'block' : 'hidden'
        )}
      >
        <div className="sticky top-0 rounded-xl border border-border bg-card p-4">
          <FilterPanel filters={filters} onChange={handleFiltersChange} />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((s) => !s)}
              className="gap-2"
            >
              <SlidersHorizontalIcon className="h-3.5 w-3.5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {data && (
              <p className="text-sm text-muted-foreground">
                {data.total.toLocaleString()} review{data.total !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader size="lg" text="Loading reviews…" />
          </div>
        )}

        {error && !isLoading && (
          <ErrorState
            title="Failed to load reviews"
            message={error.message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && (!data || data.reviews.length === 0) && (
          <EmptyState
            title="No reviews found"
            description="Try adjusting your filters or load reviews first."
          />
        )}

        {!isLoading && !error && data && data.reviews.length > 0 && (
          <ReviewTable
            data={data}
            page={filters.page ?? 1}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

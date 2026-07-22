import { useState } from 'react';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { SentimentBadge } from './SentimentBadge';
import { SourceBadge } from './SourceBadge';
import { ReviewDrawer } from './ReviewDrawer';
import type { ReviewWithAnalysis, ReviewsResponse } from '../../types/review';
import { formatDate, truncateText } from '../../utils/formatters';

function StarRating({ rating }: { rating?: number }) {
  if (rating === undefined || rating === null) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`h-3 w-3 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );
}

interface ReviewTableProps {
  data: ReviewsResponse;
  page: number;
  onPageChange: (page: number) => void;
}

export function ReviewTable({ data, page, onPageChange }: ReviewTableProps) {
  const [selectedReview, setSelectedReview] = useState<ReviewWithAnalysis | null>(null);

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Source</TableHead>
              <TableHead className="w-[90px]">Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="w-[100px]">Sentiment</TableHead>
              <TableHead className="w-[120px]">Theme</TableHead>
              <TableHead className="w-[100px]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              data.reviews.map((review) => (
                <TableRow
                  key={review.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedReview(review)}
                >
                  <TableCell>
                    <SourceBadge source={review.source} />
                  </TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} />
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-foreground leading-snug">
                      {truncateText(review.review, 100)}
                    </p>
                  </TableCell>
                  <TableCell>
                    {review.analysis?.sentiment ? (
                      <SentimentBadge sentiment={review.analysis.sentiment} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {review.analysis?.themes?.[0] ? (
                      <span className="text-xs text-muted-foreground">
                        {review.analysis.themes[0]}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.reviewDate ?? review.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {data.totalPages} &nbsp;({data.total} results)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= data.totalPages}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ReviewDrawer
        review={selectedReview}
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}

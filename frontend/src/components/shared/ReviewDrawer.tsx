import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ConfidenceBar } from './ConfidenceBar';
import { SentimentBadge } from './SentimentBadge';
import { SourceBadge } from './SourceBadge';
import type { ReviewWithAnalysis } from '../../types/review';
import { formatDate } from '../../utils/formatters';
import { StarIcon } from 'lucide-react';

interface ReviewDrawerProps {
  review: ReviewWithAnalysis | null;
  open: boolean;
  onClose: () => void;
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating}/5</span>
    </div>
  );
}

export function ReviewDrawer({ review, open, onClose }: ReviewDrawerProps) {
  if (!review) return null;
  const a = review.analysis;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Review Details</SheetTitle>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <SourceBadge source={review.source} />
            {a?.sentiment && <SentimentBadge sentiment={a.sentiment} />}
            <StarRating rating={review.rating} />
          </div>
          {review.reviewDate && (
            <p className="text-xs text-muted-foreground">{formatDate(review.reviewDate)}</p>
          )}
          {review.username && (
            <p className="text-xs text-muted-foreground">by {review.username}</p>
          )}
        </SheetHeader>

        <Separator className="my-4" />

        {/* Original review */}
        <section className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Original Review
          </h4>
          <p className="text-sm text-foreground leading-relaxed">{review.review}</p>
        </section>

        {a && (
          <>
            <Separator className="my-4" />

            {/* Summary */}
            {a.summary && (
              <section className="mb-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Summary
                </h4>
                <p className="text-sm text-foreground leading-relaxed">{a.summary}</p>
              </section>
            )}

            {/* Emotion */}
            {a.emotion && (
              <section className="mb-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Emotion
                </h4>
                <Badge variant="secondary">{a.emotion}</Badge>
              </section>
            )}

            {/* Themes */}
            {a.themes && a.themes.length > 0 && (
              <section className="mb-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Themes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {a.themes.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Pain Points */}
            {a.painPoints && a.painPoints.length > 0 && (
              <section className="mb-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Pain Points
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {a.painPoints.map((p) => (
                    <Badge key={p} variant="destructive" className="text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Feature Requests */}
            {a.featureRequests && a.featureRequests.length > 0 && (
              <section className="mb-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Feature Requests
                </h4>
                <ul className="space-y-1">
                  {a.featureRequests.map((fr, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {fr}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Separator className="my-4" />

            {/* Extra attributes */}
            <div className="grid grid-cols-1 gap-3 mb-5">
              {a.shoppingHabit && (
                <div>
                  <span className="text-xs text-muted-foreground">Shopping Habit: </span>
                  <span className="text-sm text-foreground">{a.shoppingHabit}</span>
                </div>
              )}
              {a.barrier && (
                <div>
                  <span className="text-xs text-muted-foreground">Barrier: </span>
                  <span className="text-sm text-foreground">{a.barrier}</span>
                </div>
              )}
              {a.experimentLikelihood && (
                <div>
                  <span className="text-xs text-muted-foreground">Experiment Likelihood: </span>
                  <span className="text-sm text-foreground">{a.experimentLikelihood}</span>
                </div>
              )}
            </div>

            {/* Confidence */}
            <ConfidenceBar value={a.confidence} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

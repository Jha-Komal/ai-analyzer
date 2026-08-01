import React, { useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import type { ReviewFilters } from '../../types/review';

const SOURCES = ['reddit', 'playstore', 'appstore', 'x'];

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  reddit: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12C24 5.373 18.627 0 12 0zm6 13.534c0 2.666-3.582 4.821-8 4.821s-8-2.155-8-4.821c0-.414.067-.813.19-1.192a1.627 1.627 0 0 1-.69-1.342c0-.9.73-1.629 1.63-1.629.44 0 .84.177 1.134.464C5.48 9.18 7.105 8.617 8.953 8.56l.976-4.558 3.16.662a1.257 1.257 0 1 1 2.502.124l-2.785-.583-.864 4.04c1.865.046 3.508.612 4.72 1.498.293-.289.695-.467 1.138-.467.9 0 1.629.729 1.629 1.629 0 .543-.27 1.022-.682 1.313.123.38.191.78.191 1.195zM9.25 13.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm5.5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm-2.75 3.986a.374.374 0 0 0-.258.638c.634.634 2.077.634 2.71 0a.374.374 0 0 0-.527-.529c-.425.424-1.23.424-1.655 0a.373.373 0 0 0-.27-.109z" />
    </svg>
  ),
  playstore: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l2.98-2.965L3.227.148a1.5 1.5 0 0 0-.934-.048l11.251 10.889zm0 2.067l-11.35 11.279c.267.117.568.134.853-.006l13.306-7.528-2.809-2.745z" />
    </svg>
  ),
  appstore: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
};
const SENTIMENTS = ['positive', 'neutral', 'negative'];
const RATINGS = ['1', '2', '3', '4', '5'];

interface FilterPanelProps {
  filters: ReviewFilters;
  onChange: (filters: ReviewFilters) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [localKeyword, setLocalKeyword] = useState(filters.keyword ?? '');

  function handleSourceToggle(source: string) {
    const current = filters.source ?? [];
    const next = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    onChange({ ...filters, source: next.length ? next : undefined, page: 1 });
  }

  function handleSentimentChange(value: string) {
    onChange({ ...filters, sentiment: value === 'all' ? undefined : value, page: 1 });
  }

  function handleRatingChange(value: string) {
    onChange({ ...filters, rating: value === 'all' ? undefined : parseInt(value), page: 1 });
  }

  function handleKeywordSearch() {
    onChange({ ...filters, keyword: localKeyword || undefined, page: 1 });
  }

  function handleReset() {
    setLocalKeyword('');
    onChange({ page: 1 });
  }

  const hasFilters =
    (filters.source && filters.source.length > 0) ||
    filters.sentiment ||
    filters.rating !== undefined ||
    filters.keyword;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 text-xs gap-1">
            <XIcon className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Keyword search */}
      <div className="space-y-1.5">
        <Label className="text-xs">Keyword</Label>
        <div className="flex gap-1.5">
          <Input
            placeholder="Search reviews…"
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleKeywordSearch()}
            className="h-8 text-xs"
          />
          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={handleKeywordSearch}>
            <SearchIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Source */}
      <div className="space-y-2">
        <Label className="text-xs">Source</Label>
        <div className="flex flex-wrap gap-1.5">
          {SOURCES.map((source) => {
            const active = filters.source?.includes(source);
            return (
              <button
                key={source}
                onClick={() => handleSourceToggle(source)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
              >
                {SOURCE_ICONS[source]}
                {source}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Sentiment */}
      <div className="space-y-1.5">
        <Label className="text-xs">Sentiment</Label>
        <Select
          value={filters.sentiment ?? 'all'}
          onValueChange={handleSentimentChange}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="All sentiments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sentiments</SelectItem>
            {SENTIMENTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating */}
      <div className="space-y-1.5">
        <Label className="text-xs">Rating</Label>
        <Select
          value={filters.rating?.toString() ?? 'all'}
          onValueChange={handleRatingChange}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="All ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            {RATINGS.map((r) => (
              <SelectItem key={r} value={r}>
                {'★'.repeat(parseInt(r))} ({r})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date range */}
      <Separator />
      <div className="space-y-2">
        <Label className="text-xs">Date Range</Label>
        <div className="space-y-1.5">
          <Input
            type="date"
            className="h-8 text-xs"
            value={filters.dateFrom ?? ''}
            onChange={(e) =>
              onChange({ ...filters, dateFrom: e.target.value || undefined, page: 1 })
            }
          />
          <Input
            type="date"
            className="h-8 text-xs"
            value={filters.dateTo ?? ''}
            onChange={(e) =>
              onChange({ ...filters, dateTo: e.target.value || undefined, page: 1 })
            }
          />
        </div>
      </div>
    </div>
  );
}

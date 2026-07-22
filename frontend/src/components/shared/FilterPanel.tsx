import { useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import type { ReviewFilters } from '../../types/review';

const SOURCES = ['reddit', 'playstore', 'appstore', 'x', 'community'];
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
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
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

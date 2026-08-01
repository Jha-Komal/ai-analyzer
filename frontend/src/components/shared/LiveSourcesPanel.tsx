import { CheckIcon, LoaderIcon, WifiIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SourceProgress } from '../../types/analysis';

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  reddit: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12C24 5.373 18.627 0 12 0zm6 13.534c0 2.666-3.582 4.821-8 4.821s-8-2.155-8-4.821c0-.414.067-.813.19-1.192a1.627 1.627 0 0 1-.69-1.342c0-.9.73-1.629 1.63-1.629.44 0 .84.177 1.134.464C5.48 9.18 7.105 8.617 8.953 8.56l.976-4.558 3.16.662a1.257 1.257 0 1 1 2.502.124l-2.785-.583-.864 4.04c1.865.046 3.508.612 4.72 1.498.293-.289.695-.467 1.138-.467.9 0 1.629.729 1.629 1.629 0 .543-.27 1.022-.682 1.313.123.38.191.78.191 1.195zM9.25 13.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm5.5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm-2.75 3.986a.374.374 0 0 0-.258.638c.634.634 2.077.634 2.71 0a.374.374 0 0 0-.527-.529c-.425.424-1.23.424-1.655 0a.373.373 0 0 0-.27-.109z" />
    </svg>
  ),
  playstore: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l2.98-2.965L3.227.148a1.5 1.5 0 0 0-.934-.048l11.251 10.889zm0 2.067l-11.35 11.279c.267.117.568.134.853-.006l13.306-7.528-2.809-2.745z" />
    </svg>
  ),
  appstore: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  ),
};

const SOURCE_COLORS: Record<string, string> = {
  reddit:    'text-orange-400',
  playstore: 'text-emerald-400',
  appstore:  'text-sky-400',
  x:         'text-slate-300',
};

const DEFAULT_SOURCES: SourceProgress[] = [
  { source: 'reddit',    label: 'Reddit',     status: 'pending', count: 0 },
  { source: 'playstore', label: 'Play Store',  status: 'pending', count: 0 },
  { source: 'appstore',  label: 'App Store',   status: 'pending', count: 0 },
  { source: 'x',         label: 'X / Twitter', status: 'pending', count: 0 },
];

interface LiveSourcesPanelProps {
  sourceProgress?: SourceProgress[];
}

export function LiveSourcesPanel({ sourceProgress }: LiveSourcesPanelProps) {
  const sources = sourceProgress ?? DEFAULT_SOURCES;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <WifiIcon className="h-4 w-4 text-primary animate-pulse" />
        <span className="text-sm font-semibold text-foreground">Live Data Ingestion</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {sources.filter((s) => s.status === 'done').length}/{sources.length} sources synced
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sources.map((src) => {
          const icon = SOURCE_ICONS[src.source];
          const color = SOURCE_COLORS[src.source] ?? 'text-muted-foreground';
          const isDone = src.status === 'done';
          const isActive = src.status === 'connecting' || src.status === 'fetching';
          const isPending = src.status === 'pending';

          return (
            <div
              key={src.source}
              className={cn(
                'relative flex items-center gap-3 rounded-xl border p-4 transition-all duration-300',
                isDone && 'border-primary/30 bg-primary/5',
                isActive && 'border-border bg-card shadow-[0_0_16px_rgba(248,201,28,0.08)]',
                isPending && 'border-border/50 bg-card/50 opacity-60',
              )}
            >
              {/* Status dot */}
              <span
                className={cn(
                  'absolute top-3 right-3 h-2 w-2 rounded-full',
                  isDone && 'bg-emerald-400',
                  isActive && 'bg-primary animate-pulse',
                  isPending && 'bg-muted-foreground/40',
                )}
              />

              {/* Icon */}
              <div className={cn('shrink-0', color)}>{icon}</div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">{src.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {src.status === 'pending' && 'Waiting…'}
                  {src.status === 'connecting' && 'Connecting…'}
                  {src.status === 'fetching' && 'Fetching…'}
                  {src.status === 'done' && 'Fetched'}
                </p>
              </div>

              {/* Status icon */}
              <div className="shrink-0">
                {isDone && <CheckIcon className="h-4 w-4 text-emerald-400" />}
                {isActive && <LoaderIcon className="h-4 w-4 text-primary animate-spin" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

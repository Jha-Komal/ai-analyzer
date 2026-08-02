import { Badge } from '../ui/badge';

export interface SimpleListItem {
  title: string;
  subtitle?: string;
  badge?: string;
}

interface SimpleListSectionProps {
  heading: string;
  items: SimpleListItem[];
}

export function SimpleListSection({ heading, items }: SimpleListSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              {item.badge && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {item.badge}
                </Badge>
              )}
            </div>
            {item.subtitle && <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

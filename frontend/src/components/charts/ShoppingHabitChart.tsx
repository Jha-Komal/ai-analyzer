import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { toTopN } from '../../utils/formatters';

interface ShoppingHabitChartProps {
  distribution: Record<string, number>;
}

const COLORS = ['#f8c91c', '#10b981', '#6366f1', '#f97316', '#38bdf8', '#ec4899', '#a78bfa', '#34d399'];

function truncate(s: string, max = 24) {
  const clean = s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean;
}

export function ShoppingHabitChart({ distribution }: ShoppingHabitChartProps) {
  const data = toTopN(distribution, 8).map((d) => ({
    name: d.name,
    label: truncate(d.name),
    value: d.value,
  }));

  return (
    <ChartWrapper title="Shopping Habits" subtitle="How customers describe their buying behaviour">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={160}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [value, 'Reviews']}
            labelFormatter={(label) => data.find((d) => d.label === label)?.name ?? label}
          />
          <Bar dataKey="value" name="Count" radius={[0, 6, 6, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

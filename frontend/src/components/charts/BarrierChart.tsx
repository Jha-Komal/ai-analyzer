import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { toTopN } from '../../utils/formatters';

interface BarrierChartProps {
  distribution: Record<string, number>;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#3b82f6'];

function formatLabel(name: string) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BarrierChart({ distribution }: BarrierChartProps) {
  const data = toTopN(distribution, 8).map((d) => ({
    name: formatLabel(d.name),
    value: d.value,
  }));

  return (
    <ChartWrapper title="Purchase Barriers" subtitle="What stops customers from buying or returning">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={130}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [value, 'Mentions']}
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

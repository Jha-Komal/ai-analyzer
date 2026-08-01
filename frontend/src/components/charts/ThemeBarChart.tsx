import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { CHART_COLORS } from '../../utils/colors';
import { toTopN } from '../../utils/formatters';

interface ThemeBarChartProps {
  distribution: Record<string, number>;
}

function truncate(s: string, max = 22) {
  const clean = s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean;
}

export function ThemeBarChart({ distribution }: ThemeBarChartProps) {
  const data = toTopN(distribution, 10).map((d) => ({ ...d, label: truncate(d.name) }));

  return (
    <ChartWrapper title="Top Themes" subtitle="Most common themes across reviews">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={155}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
            formatter={(value: number) => [value, 'Mentions']}
            labelFormatter={(label) => data.find((d) => d.label === label)?.name ?? label}
          />
          <Bar dataKey="value" name="Count" radius={[0, 6, 6, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

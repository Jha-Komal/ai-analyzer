import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { CHART_COLORS } from '../../utils/colors';
import { toTopN } from '../../utils/formatters';

interface ThemeBarChartProps {
  distribution: Record<string, number>;
}

export function ThemeBarChart({ distribution }: ThemeBarChartProps) {
  const data = toTopN(distribution, 10);

  return (
    <ChartWrapper title="Top Themes" subtitle="Most common themes across reviews">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
          />
          <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

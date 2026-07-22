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
import { toChartData } from '../../utils/formatters';

interface CategoryBarChartProps {
  distribution: Record<string, number>;
}

export function CategoryBarChart({ distribution }: CategoryBarChartProps) {
  const data = toChartData(distribution);

  return (
    <ChartWrapper title="Category Distribution" subtitle="Reviews by category">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
          />
          <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

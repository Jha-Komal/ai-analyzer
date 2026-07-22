import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { SOURCE_COLORS, CHART_COLORS } from '../../utils/colors';
import type { DashboardData } from '../../types/dashboard';

interface SourcePieChartProps {
  data: DashboardData;
}

export function SourcePieChart({ data }: SourcePieChartProps) {
  const dist = data.sourceDistribution ?? {};
  const chartData = Object.entries(dist)
    .map(([name, value], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: SOURCE_COLORS[name.toLowerCase()] ?? CHART_COLORS[i % CHART_COLORS.length],
    }))
    .filter((d) => d.value > 0);

  if (chartData.length === 0) {
    return (
      <ChartWrapper title="Source Distribution" subtitle="Reviews by platform">
        <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
          No source data available
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper title="Source Distribution" subtitle="Reviews by platform">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [value, 'Reviews']}
            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

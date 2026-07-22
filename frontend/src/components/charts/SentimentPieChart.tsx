import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { SENTIMENT_COLORS } from '../../utils/colors';
import type { DashboardData } from '../../types/dashboard';

interface SentimentPieChartProps {
  data: DashboardData;
}

export function SentimentPieChart({ data }: SentimentPieChartProps) {
  const chartData = [
    { name: 'Positive', value: data.positiveCount, color: SENTIMENT_COLORS.positive },
    { name: 'Neutral', value: data.neutralCount, color: SENTIMENT_COLORS.neutral },
    { name: 'Negative', value: data.negativeCount, color: SENTIMENT_COLORS.negative },
  ].filter((d) => d.value > 0);

  return (
    <ChartWrapper title="Sentiment Distribution" subtitle="Overall review sentiment breakdown">
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
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
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

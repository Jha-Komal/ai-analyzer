import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import type { SentimentTrendPoint } from '../../types/dashboard';

interface TrendChartProps {
  data: SentimentTrendPoint[];
}

function formatMonth(key: string) {
  const [year, month] = key.split('-');
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function TrendChart({ data }: TrendChartProps) {
  const formatted = data.map((d) => ({ ...d, month: formatMonth(d.month) }));

  return (
    <ChartWrapper
      title="Sentiment Over Time"
      subtitle="Monthly review volume by sentiment"
      className="xl:col-span-2"
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={formatted} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
          <defs>
            <linearGradient id="gradPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradNeutral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f8c91c" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f8c91c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: 11, textTransform: 'capitalize' }}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="positive"
            name="Positive"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradPositive)"
          />
          <Area
            type="monotone"
            dataKey="neutral"
            name="Neutral"
            stroke="#f8c91c"
            strokeWidth={2}
            fill="url(#gradNeutral)"
          />
          <Area
            type="monotone"
            dataKey="negative"
            name="Negative"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#gradNegative)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

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
import { toTopN } from '../../utils/formatters';

interface PainPointBarChartProps {
  distribution: Record<string, number>;
}

const PAIN_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280'];

export function PainPointBarChart({ distribution }: PainPointBarChartProps) {
  const data = toTopN(distribution, 10);

  return (
    <ChartWrapper title="Top Pain Points" subtitle="Most reported customer pain points">
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
              <Cell key={index} fill={PAIN_COLORS[index % PAIN_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

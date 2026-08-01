import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { toChartData } from '../../utils/formatters';

interface ShoppingHabitChartProps {
  distribution: Record<string, number>;
}

const COLORS = ['#f8c91c', '#10b981', '#6366f1', '#f97316', '#38bdf8', '#ec4899'];

function formatLabel(name: string) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ShoppingHabitChart({ distribution }: ShoppingHabitChartProps) {
  const data = toChartData(distribution).map((d) => ({
    name: formatLabel(d.name),
    value: d.value,
  }));

  return (
    <ChartWrapper title="Shopping Habits" subtitle="How customers describe their buying behaviour">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [value, 'Reviews']}
          />
          <Legend formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { toChartData } from '../../utils/formatters';

interface EmotionRadarChartProps {
  distribution: Record<string, number>;
}

export function EmotionRadarChart({ distribution }: EmotionRadarChartProps) {
  const data = toChartData(distribution).map((d) => ({
    emotion: d.name.charAt(0).toUpperCase() + d.name.slice(1),
    count: d.value,
  }));

  return (
    <ChartWrapper title="Emotion Profile" subtitle="Spider view of emotional distribution across reviews">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="emotion"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          />
          <PolarRadiusAxis
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Radar
            name="Reviews"
            dataKey="count"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ r: 3, fill: 'hsl(var(--primary))' }}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [value, 'Reviews']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

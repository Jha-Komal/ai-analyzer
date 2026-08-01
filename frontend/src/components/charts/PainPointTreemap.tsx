import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { toTopN } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/colors';

interface PainPointTreemapProps {
  distribution: Record<string, number>;
}

function CustomContent(props: {
  x?: number; y?: number; width?: number; height?: number;
  name?: string; value?: number; depth?: number; index?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name = '', index = 0 } = props;
  if (width < 30 || height < 20) return null;
  const color = CHART_COLORS[index % CHART_COLORS.length];
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.85} rx={6} ry={6} />
      {width > 60 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={width > 120 ? 12 : 10}
          fontWeight={500}
        >
          {name.length > 18 ? name.slice(0, 16) + '…' : name}
        </text>
      )}
    </g>
  );
}

export function PainPointTreemap({ distribution }: PainPointTreemapProps) {
  const data = toTopN(distribution, 15).map((d) => ({ name: d.name, size: d.value }));

  return (
    <ChartWrapper title="Pain Points Map" subtitle="Customer pain points sized by frequency">
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          content={<CustomContent />}
        >
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [value, 'Mentions']}
          />
        </Treemap>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

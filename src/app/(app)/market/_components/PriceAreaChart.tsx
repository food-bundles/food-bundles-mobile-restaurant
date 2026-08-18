import { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { color, radius, signatureDuration, space, text } from '@/theme';
import { formatRwf } from '@/lib';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHART_HEIGHT = 160;
const PADDING = 16;

export interface PriceAreaChartProps {
  values: number[];
  dayLabels: string[];
}

function buildPaths(values: number[], chartWidth: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const usableWidth = chartWidth - PADDING * 2;
  const usableHeight = CHART_HEIGHT - PADDING * 2;
  const step = usableWidth / (values.length - 1);

  const points = values.map((value, index) => {
    const x = PADDING + index * step;
    const y = PADDING + usableHeight - ((value - min) / range) * usableHeight;
    return { x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART_HEIGHT - PADDING} L ${points[0].x} ${CHART_HEIGHT - PADDING} Z`;
  const lastPoint = points[points.length - 1];

  return { linePath, areaPath, lastPoint };
}

/** Approximates the path length of a polyline for a stroke-dashoffset draw-in. */
function estimatePathLength(values: number[], chartWidth: number): number {
  const { linePath } = buildPaths(values, chartWidth);
  const coords = linePath.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  let length = 0;
  for (let i = 2; i < coords.length; i += 2) {
    const dx = coords[i] - coords[i - 2];
    const dy = coords[i + 1] - coords[i - 1];
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

/** Seven-point area chart with a left-to-right draw-in on data change. */
export function PriceAreaChart({ values, dayLabels }: PriceAreaChartProps) {
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - space.lg * 2 - space.lg * 2;
  const { linePath, areaPath, lastPoint } = buildPaths(values, chartWidth);
  const pathLength = estimatePathLength(values, chartWidth);
  const dashOffset = useSharedValue(pathLength);

  useEffect(() => {
    dashOffset.value = pathLength;
    dashOffset.value = withTiming(0, { duration: signatureDuration.marketChartDrawIn });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linePath]);

  const lineProps = useAnimatedProps(() => ({ strokeDashoffset: dashOffset.value }));

  return (
    <View style={styles.wrap}>
      <Svg width={chartWidth} height={CHART_HEIGHT} viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}>
        <Path d={areaPath} fill={color.leaf} opacity={0.15} />
        <AnimatedPath
          d={linePath}
          stroke={color.leaf}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
          animatedProps={lineProps}
        />
      </Svg>
      <View style={[styles.priceBadge, { left: Math.min(lastPoint.x - 28, chartWidth - 76) }]}>
        <Text style={styles.priceBadgeLabel}>{formatRwf(values[values.length - 1])}</Text>
      </View>
      <View style={[styles.axisRow, { width: chartWidth }]}>
        {dayLabels.map((label) => (
          <Text key={label} style={styles.axisLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  priceBadge: {
    position: 'absolute',
    top: 4,
    backgroundColor: color.leaf,
    borderRadius: radius.sm,
    paddingHorizontal: space.xs,
    paddingVertical: 2,
  },
  priceBadgeLabel: { ...text.micro, color: color.paper },
  axisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs },
  axisLabel: { ...text.micro, color: color.muted },
});

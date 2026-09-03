import { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { radius, signatureDuration, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { guardSeries } from './chartMath';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHART_HEIGHT = 160;
const PADDING = 16;
const GRID_LINES = 4;
const GRADIENT_ID = 'priceAreaGradient';

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
  const step = usableWidth / (values.length - 1 || 1);

  const points = values.map((value, index) => {
    const x = PADDING + index * step;
    const y = PADDING + usableHeight - ((value - min) / range) * usableHeight;
    return { x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART_HEIGHT - PADDING} L ${points[0].x} ${CHART_HEIGHT - PADDING} Z`;
  const lastPoint = points[points.length - 1];

  return { points, linePath, areaPath, lastPoint };
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

/** Seven-point gradient area chart with data-point markers and a left-to-right draw-in on data change. */
export function PriceAreaChart({ values: rawValues, dayLabels }: PriceAreaChartProps) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - space.lg * 2 - space.lg * 2;
  const values = guardSeries(rawValues);
  const { points, linePath, areaPath, lastPoint } = buildPaths(values, chartWidth);
  const pathLength = estimatePathLength(values, chartWidth);
  const dashOffset = useSharedValue(pathLength);

  useEffect(() => {
    dashOffset.value = pathLength;
    dashOffset.value = withTiming(0, { duration: signatureDuration.marketChartDrawIn });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linePath]);

  const lineProps = useAnimatedProps(() => ({ strokeDashoffset: dashOffset.value }));
  const badgeLeft = Math.min(lastPoint.x - 28, chartWidth - 76);

  return (
    <View style={styles.wrap}>
      <Svg width={chartWidth} height={CHART_HEIGHT} viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}>
        <Defs>
          <LinearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.leaf} stopOpacity={0.25} />
            <Stop offset="1" stopColor={colors.leaf} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {Array.from({ length: GRID_LINES }, (_, index) => {
          const y = PADDING + (index * (CHART_HEIGHT - PADDING * 2)) / (GRID_LINES - 1);
          return <Line key={index} x1={PADDING} y1={y} x2={chartWidth - PADDING} y2={y} stroke={colors.hairline} strokeWidth={1} />;
        })}
        <Path d={areaPath} fill={`url(#${GRADIENT_ID})`} />
        <AnimatedPath
          d={linePath}
          stroke={colors.leaf}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
          animatedProps={lineProps}
        />
        {points.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r={4} fill={colors.leaf} stroke={colors.paper} strokeWidth={1.5} />
        ))}
        <Line
          x1={lastPoint.x}
          y1={lastPoint.y}
          x2={lastPoint.x}
          y2={CHART_HEIGHT - PADDING}
          stroke={colors.leaf}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      </Svg>
      <View style={[styles.priceBadge, { backgroundColor: colors.leaf, left: badgeLeft }]}>
        <Text style={[styles.priceBadgeLabel, { color: colors.paper }]}>{formatRwf(values[values.length - 1])}</Text>
      </View>
      <View style={[styles.axisRow, { width: chartWidth }]}>
        {dayLabels.map((label) => (
          <Text key={label} style={[styles.axisLabel, { color: colors.muted }]}>
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
    borderRadius: radius.sm,
    paddingHorizontal: space.xs,
    paddingVertical: 2,
  },
  priceBadgeLabel: { ...text.micro },
  axisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs },
  axisLabel: { ...text.micro },
});

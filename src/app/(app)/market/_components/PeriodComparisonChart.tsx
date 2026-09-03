import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Badge } from '@/components/primitives';
import { space, useTheme } from '@/theme';
import { CHART_HEIGHT, CHART_PADDING } from './chartMath';
import { useT } from '@/i18n';

export interface PeriodComparisonChartProps {
  current: number[];
  previous: number[];
}

function toPath(points: { x: number; y: number }[]): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

/** Two overlapping area charts for the current vs. comparison period, plus a net-difference badge. */
export function PeriodComparisonChart({ current, previous }: PeriodComparisonChartProps) {
  const t = useT();
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - space.lg * 2 - space.lg * 2;

  const combined = [...current, ...previous];
  const max = Math.max(...combined);
  const min = Math.min(...combined);
  const range = max - min || 1;
  const usableWidth = chartWidth - CHART_PADDING * 2;
  const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const scale = (value: number, index: number, length: number) => ({
    x: CHART_PADDING + (index * usableWidth) / (length - 1),
    y: CHART_PADDING + usableHeight - ((value - min) / range) * usableHeight,
  });

  const currentPoints = current.map((value, index) => scale(value, index, current.length));
  const previousPoints = previous.map((value, index) => scale(value, index, previous.length));

  const lastCurrent = current[current.length - 1];
  const lastPrevious = previous[previous.length - 1];
  const netDiffPct = ((lastCurrent - lastPrevious) / lastPrevious) * 100;

  return (
    <View>
      <Svg width={chartWidth} height={CHART_HEIGHT} viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}>
        <Path d={toPath(previousPoints)} stroke={colors.oat} strokeWidth={2} strokeDasharray="6 4" fill="none" />
        <Path d={toPath(currentPoints)} stroke={colors.leaf} strokeWidth={2.5} fill="none" />
      </Svg>
      <View style={styles.badgeRow}>
        <Badge
          tone={netDiffPct >= 0 ? 'ripe' : 'chili'}
          label={t('compare_netDifference', { sign: netDiffPct >= 0 ? '+' : '', percent: netDiffPct.toFixed(1) })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeRow: { marginTop: space.sm, alignItems: 'center' },
});

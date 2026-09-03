import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { space, useTheme } from '@/theme';
import { CHART_HEIGHT, CHART_PADDING, movingAverage } from './chartMath';

export interface MovingAverageOverlayProps {
  values: number[];
  windowSize?: number;
}

/** Dashed 7-day moving-average line, scaled against the same combined range as the price line beneath it. */
export function MovingAverageOverlay({ values, windowSize = 7 }: MovingAverageOverlayProps) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - space.lg * 2 - space.lg * 2;

  const ma = movingAverage(values, windowSize);
  const combined = [...values, ...ma];
  const max = Math.max(...combined);
  const min = Math.min(...combined);
  const range = max - min || 1;
  const usableWidth = chartWidth - CHART_PADDING * 2;
  const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const step = usableWidth / (ma.length - 1);

  const path = ma
    .map((value, index) => {
      const x = CHART_PADDING + index * step;
      const y = CHART_PADDING + usableHeight - ((value - min) / range) * usableHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Svg width={chartWidth} height={CHART_HEIGHT} viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}>
        <Path d={path} stroke={colors.marigold} strokeWidth={2} strokeDasharray="6 4" fill="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0 },
});

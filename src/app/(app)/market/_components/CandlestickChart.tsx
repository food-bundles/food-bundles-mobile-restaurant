import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { signatureDuration, space, useTheme } from '@/theme';
import type { OhlcDay } from '@/mocks';

export interface CandlestickChartProps {
  candles: OhlcDay[];
}

const CHART_HEIGHT = 160;
const PADDING = 16;

/** OHLC candlestick chart — a wick line plus a filled body bar per day, drawn in on mount. */
export function CandlestickChart({ candles }: CandlestickChartProps) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - space.lg * 2 - space.lg * 2;
  const growth = useSharedValue(0);

  useEffect(() => {
    growth.value = 0;
    growth.value = withTiming(1, { duration: signatureDuration.marketChartDrawIn });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles]);

  const growStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: growth.value }] }));

  const allValues = candles.flatMap((c) => [c.high, c.low]);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min || 1;
  const usableHeight = CHART_HEIGHT - PADDING * 2;
  const usableWidth = chartWidth - PADDING * 2;
  const slotWidth = usableWidth / candles.length;
  const bodyWidth = Math.min(14, slotWidth * 0.5);

  const toY = (value: number) => PADDING + usableHeight - ((value - min) / range) * usableHeight;

  return (
    <View style={[styles.wrap, { height: CHART_HEIGHT, width: chartWidth }]}>
      {candles.map((candle, index) => {
        const isUp = candle.close >= candle.open;
        const color = isUp ? colors.ripe : colors.chili;
        const x = PADDING + index * slotWidth + slotWidth / 2;
        const bodyTop = toY(Math.max(candle.open, candle.close));
        const bodyBottom = toY(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(2, bodyBottom - bodyTop);

        return (
          <View key={index} style={[styles.candle, { left: x }]}>
            <View
              style={[
                styles.wick,
                {
                  backgroundColor: color,
                  top: toY(candle.high),
                  height: toY(candle.low) - toY(candle.high),
                  marginLeft: -0.75,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.body,
                { backgroundColor: color, top: bodyTop, height: bodyHeight, width: bodyWidth, marginLeft: -bodyWidth / 2 },
                growStyle,
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  candle: { position: 'absolute', top: 0, bottom: 0 },
  wick: { position: 'absolute', width: 1.5, left: 0 },
  body: { position: 'absolute', borderRadius: 1 },
});

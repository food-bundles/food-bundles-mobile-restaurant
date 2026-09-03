import { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { G, Line, Rect } from 'react-native-svg';
import { signatureDuration, space, useTheme } from '@/theme';
import type { OhlcDay } from '@/mocks';

const CHART_HEIGHT = 160;
const PADDING = 16;
const MIN_BODY_SIZE = 8;
const GLOW_PADDING = 3;

export interface CandlestickChartProps {
  candles: OhlcDay[];
}

/** OHLC candlestick chart — an SVG wick + filled body per day, current candle glows, drawn in on mount. */
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

  const growStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: growth.value }],
  }));

  if (candles.length === 0) return <View style={{ height: CHART_HEIGHT, width: chartWidth }} />;

  const allValues = candles.flatMap((c) => [c.high, c.low]);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min || 1;
  const usableHeight = CHART_HEIGHT - PADDING * 2;
  const usableWidth = chartWidth - PADDING * 2;
  const slotWidth = usableWidth / candles.length;
  const bodyWidth = Math.max(MIN_BODY_SIZE, slotWidth * 0.6);

  const toY = (value: number) => PADDING + usableHeight - ((value - min) / range) * usableHeight;

  return (
    <Animated.View style={[{ height: CHART_HEIGHT, width: chartWidth }, growStyle]}>
      <Svg width={chartWidth} height={CHART_HEIGHT}>
        {candles.map((candle, index) => {
          const isUp = candle.close >= candle.open;
          const color = isUp ? colors.ripe : colors.chili;
          const x = PADDING + index * slotWidth + slotWidth / 2;
          const bodyTop = toY(Math.max(candle.open, candle.close));
          const bodyBottom = toY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(MIN_BODY_SIZE, bodyBottom - bodyTop);
          const isCurrent = index === candles.length - 1;

          return (
            <G key={index}>
              {isCurrent ? (
                <Rect
                  x={x - bodyWidth / 2 - GLOW_PADDING}
                  y={bodyTop - GLOW_PADDING}
                  width={bodyWidth + GLOW_PADDING * 2}
                  height={bodyHeight + GLOW_PADDING * 2}
                  rx={2}
                  fill={color}
                  opacity={0.25}
                />
              ) : null}
              <Line x1={x} y1={toY(candle.high)} x2={x} y2={toY(candle.low)} stroke={color} strokeWidth={1} />
              <Rect x={x - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={bodyHeight} fill={color} rx={1} />
            </G>
          );
        })}
      </Svg>
    </Animated.View>
  );
}

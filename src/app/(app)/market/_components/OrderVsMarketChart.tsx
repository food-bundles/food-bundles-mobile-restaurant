import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { space, useTheme } from '@/theme';
import { CHART_HEIGHT, CHART_PADDING } from './chartMath';
import type { ItemComparison } from '@/lib';
import { useT } from '@/i18n';

export interface OrderVsMarketChartProps {
  item: ItemComparison;
}

function toPath(points: { x: number; y: number }[]): string {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

/** Overlays the restaurant's actual order prices against FoodBundles, Kimironko and Nyabugogo price lines. */
export function OrderVsMarketChart({ item }: OrderVsMarketChartProps) {
  const t = useT();
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - space.lg * 2 - space.lg * 2 - space.md * 2;

  const orderPrices = item.points.map((p) => p.pricePerUnit);
  const kimironkoPct = item.vsMarketPct.Kimironko ?? 0;
  const nyabugogoPct = item.vsMarketPct.Nyabugogo ?? 0;
  const kimironkoPrice = item.avgPaid / (1 + kimironkoPct / 100);
  const nyabugogoPrice = item.avgPaid / (1 + nyabugogoPct / 100);
  const foodBundlesLine = orderPrices.map(() => item.avgPaid);
  const kimironkoLine = orderPrices.map(() => kimironkoPrice);
  const nyabugogoLine = orderPrices.map(() => nyabugogoPrice);

  const combined = [...orderPrices, ...foodBundlesLine, ...kimironkoLine, ...nyabugogoLine];
  const max = Math.max(...combined);
  const min = Math.min(...combined);
  const range = max - min || 1;
  const usableWidth = chartWidth - CHART_PADDING * 2;
  const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const scale = (value: number, index: number, length: number) => ({
    x: length > 1 ? CHART_PADDING + (index * usableWidth) / (length - 1) : chartWidth / 2,
    y: CHART_PADDING + usableHeight - ((value - min) / range) * usableHeight,
  });

  const orderPoints = orderPrices.map((value, index) => scale(value, index, orderPrices.length));
  const foodBundlesPoints = foodBundlesLine.map((value, index) => scale(value, index, foodBundlesLine.length));
  const kimironkoPoints = kimironkoLine.map((value, index) => scale(value, index, kimironkoLine.length));
  const nyabugogoPoints = nyabugogoLine.map((value, index) => scale(value, index, nyabugogoLine.length));

  const onOrderPress = (orderId: string) => {
    router.push({ pathname: '/(app)/orders/[id]', params: { id: orderId } });
  };

  return (
    <View>
      <Svg width={chartWidth} height={CHART_HEIGHT} viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}>
        <Path d={toPath(foodBundlesPoints)} stroke={colors.leaf} strokeWidth={2} fill="none" />
        <Path d={toPath(kimironkoPoints)} stroke={colors.marigold} strokeWidth={1.5} strokeDasharray="6 4" fill="none" />
        <Path d={toPath(nyabugogoPoints)} stroke={colors.secondary} strokeWidth={1.5} strokeDasharray="6 4" fill="none" />
        {orderPoints.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r={5} fill={colors.leaf} />
        ))}
      </Svg>
      <View style={styles.tapRow} accessibilityLabel={t('priceHistory_ordersOnChart')}>
        {item.points.map((point, index) => (
          <Pressable
            key={point.orderId}
            onPress={() => onOrderPress(point.orderId)}
            accessibilityRole="button"
            accessibilityLabel={t('priceHistory_viewOrder', { orderId: point.orderId })}
            style={[styles.tapDot, { left: orderPoints[index].x - 22 }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tapRow: { position: 'relative', height: 44, marginTop: -44 },
  tapDot: { position: 'absolute', width: 44, height: 44, top: 0 },
});

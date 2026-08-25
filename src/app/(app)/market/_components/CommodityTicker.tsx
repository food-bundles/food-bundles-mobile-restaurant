import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { radius, signatureDuration, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { COMMODITIES, PRICE_HISTORY } from '@/mocks';
import { weeklyAverage } from './marketAnalytics';

/** Stock-ticker-style marquee cycling through each tracked commodity's price and delta every 3s. */
export function CommodityTicker() {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      opacity.value = withTiming(0, { duration: signatureDuration.tickerFade }, () => {
        opacity.value = withTiming(1, { duration: signatureDuration.tickerFade });
      });
      setIndex((prev) => (prev + 1) % COMMODITIES.length);
    }, signatureDuration.tickerCycle);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const commodity = COMMODITIES[index];
  const history = PRICE_HISTORY[commodity.id];
  const { changePct } = weeklyAverage(history);
  const isUp = changePct >= 0;

  return (
    <View style={[styles.wrap, { backgroundColor: colors.pine }]}>
      <Animated.View style={[styles.row, fadeStyle]}>
        <Text style={[styles.name, { color: colors.onPine }]}>{commodity.name}</Text>
        <Text style={[styles.price, { color: colors.paper }]}>{formatRwf(history[history.length - 1])}</Text>
        <Text style={[styles.delta, { color: isUp ? colors.onPineBright : colors.chili }]}>
          {isUp ? '▲' : '▼'} {Math.abs(changePct).toFixed(1)}%
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.md, paddingVertical: space.sm, paddingHorizontal: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  name: { ...text.caption },
  price: { ...text.bodySemi, fontVariant: ['tabular-nums'] },
  delta: { ...text.label, fontVariant: ['tabular-nums'] },
});

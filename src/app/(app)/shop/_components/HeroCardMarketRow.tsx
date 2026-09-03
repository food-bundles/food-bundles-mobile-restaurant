import { useEffect, useState } from 'react';
import { StyleSheet, Text, type ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { signatureDuration, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import type { MarketRow } from './HeroCardMarketPrices';

export interface HeroCardMarketRowProps {
  row: MarketRow;
  index: number;
  highlightStyle: AnimatedStyle<ViewStyle>;
}

/** One market-price row: its price figure counts up from 0, staggered by row index. */
export function HeroCardMarketRow({ row, index, highlightStyle }: HeroCardMarketRowProps) {
  const { colors } = useTheme();
  const countUp = useSharedValue(0);
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    countUp.value = 0;
    countUp.value = withDelay(
      index * signatureDuration.carouselPriceStagger,
      withTiming(row.price, { duration: signatureDuration.limitPreviewCountUp }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.price, index]);

  useAnimatedReaction(
    () => Math.round(countUp.value),
    (rounded, previous) => {
      if (rounded !== previous) runOnJS(setDisplayPrice)(rounded);
    },
  );

  if (row.best) {
    return (
      <Animated.View style={[styles.row, styles.bestRow, highlightStyle]}>
        <Text style={[styles.marketBest, { color: colors.leaf }]}>{row.market}</Text>
        <Text style={[styles.priceBest, { color: colors.leaf }]}>{formatRwf(displayPrice)}</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={styles.row}>
      <Text style={[styles.market, { color: colors.secondary }]}>{row.market}</Text>
      <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(displayPrice)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 1 },
  bestRow: { paddingLeft: space.xs, borderLeftWidth: 2, borderLeftColor: 'transparent' },
  market: { ...text.caption },
  marketBest: { ...text.bodySemi },
  price: { ...text.caption, fontVariant: ['tabular-nums'] },
  priceBest: { ...text.bodySemi, fontVariant: ['tabular-nums'] },
});

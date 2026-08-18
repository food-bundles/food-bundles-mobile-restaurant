import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { signatureDuration, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';

export interface MarketRow {
  market: string;
  price: number;
  best?: boolean;
}

export interface HeroCardMarketPricesProps {
  phase: 1 | 2;
  overline: string;
  badge: string;
  commodity: string;
  rows: MarketRow[];
  linkLabel: string;
  onPress: () => void;
}

export function HeroCardMarketPrices({
  phase,
  overline,
  badge,
  commodity,
  rows,
  linkLabel,
  onPress,
}: HeroCardMarketPricesProps) {
  const { colors } = useTheme();
  const highlight = useSharedValue(0);

  useEffect(() => {
    highlight.value = phase === 2 ? withTiming(1, { duration: signatureDuration.carouselPhaseFade }) : withTiming(0);
  }, [highlight, phase]);

  const highlightStyle = useAnimatedStyle(() => ({
    borderLeftWidth: 2 + highlight.value * 2,
    borderLeftColor: colors.leaf,
  }));

  return (
    <HeroCardShell
      onPress={onPress}
      accessibilityLabel={`${overline}, ${commodity}`}
      tone="paper"
      overline={overline}
      badge={badge}
    >
      <View>
        <Text style={[styles.commodity, { color: colors.ink }]}>{commodity}</Text>
        {rows.map((row) =>
          row.best ? (
            <Animated.View key={row.market} style={[styles.row, styles.bestRow, highlightStyle]}>
              <Text style={[styles.marketBest, { color: colors.leaf }]}>{row.market}</Text>
              <Text style={[styles.priceBest, { color: colors.leaf }]}>{formatRwf(row.price)}</Text>
            </Animated.View>
          ) : (
            <View key={row.market} style={styles.row}>
              <Text style={[styles.market, { color: colors.secondary }]}>{row.market}</Text>
              <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(row.price)}</Text>
            </View>
          ),
        )}
      </View>
      <HeroCardLink label={linkLabel} tone="leaf" />
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  commodity: { ...text.bodySemi, marginBottom: space.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 1 },
  bestRow: { paddingLeft: space.xs, borderLeftWidth: 2, borderLeftColor: 'transparent' },
  market: { ...text.caption },
  marketBest: { ...text.bodySemi },
  price: { ...text.caption, fontVariant: ['tabular-nums'] },
  priceBest: { ...text.bodySemi, fontVariant: ['tabular-nums'] },
});

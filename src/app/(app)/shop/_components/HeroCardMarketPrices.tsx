import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { signatureDuration, space, text, useTheme } from '@/theme';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';
import { HeroCardMarketRow } from './HeroCardMarketRow';

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
        {rows.map((row, index) => (
          <HeroCardMarketRow key={row.market} row={row} index={index} highlightStyle={highlightStyle} />
        ))}
      </View>
      <HeroCardLink label={linkLabel} tone="leaf" />
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  commodity: { ...text.bodySemi, marginBottom: space.xs },
});

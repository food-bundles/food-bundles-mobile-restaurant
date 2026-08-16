import { StyleSheet, Text, View } from 'react-native';
import { color, space, text } from '@/theme';
import { formatRwf } from '@/lib';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';

export interface MarketRow {
  market: string;
  price: number;
  best?: boolean;
}

export interface HeroCardMarketPricesProps {
  overline: string;
  badge: string;
  commodity: string;
  rows: MarketRow[];
  linkLabel: string;
  onPress: () => void;
}

export function HeroCardMarketPrices({
  overline,
  badge,
  commodity,
  rows,
  linkLabel,
  onPress,
}: HeroCardMarketPricesProps) {
  return (
    <HeroCardShell onPress={onPress} accessibilityLabel={`${overline}, ${commodity}`} tone="paper" overline={overline} badge={badge}>
      <View>
        <Text style={styles.commodity}>{commodity}</Text>
        {rows.map((row) => (
          <View key={row.market} style={styles.row}>
            <Text style={[styles.market, row.best && styles.marketBest]}>{row.market}</Text>
            <Text style={[styles.price, row.best && styles.priceBest]}>{formatRwf(row.price)}</Text>
          </View>
        ))}
      </View>
      <HeroCardLink label={linkLabel} tone="leaf" />
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  commodity: { ...text.bodySemi, color: color.ink, marginBottom: space.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 1 },
  market: { ...text.caption, color: color.secondary },
  marketBest: { ...text.bodySemi, color: color.leaf },
  price: { ...text.caption, color: color.ink, fontVariant: ['tabular-nums'] },
  priceBest: { ...text.bodySemi, color: color.leaf, fontVariant: ['tabular-nums'] },
});

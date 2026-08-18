import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { formatRwf } from '@/lib';
import { Badge } from '@/components/primitives';
import { Sparkline } from './Sparkline';
import { PriceAreaChart } from './PriceAreaChart';
import { useT } from '@/i18n';
import type { CommodityId, MarketComparisonRow as MarketComparisonRowData } from '@/mocks';
import { getPriceSeries } from '@/mocks';

export interface MarketComparisonRowProps {
  row: MarketComparisonRowData;
  latestPrice: number;
  commodity: CommodityId;
  expanded: boolean;
  onToggle: () => void;
}

const STOCK_KEY = {
  HIGH: 'market_stockHigh',
  MEDIUM: 'market_stockMedium',
  LOW: 'market_stockLow',
} as const;

/** One row of the market comparison table; tapping expands a full 7-day chart for that market. */
export function MarketComparisonRow({ row, latestPrice, commodity, expanded, onToggle }: MarketComparisonRowProps) {
  const t = useT();
  const price = Math.round(latestPrice * row.priceMultiplier);
  const series = getPriceSeries(commodity, '7D');
  const scaledValues = series.values.map((value) => Math.round(value * row.priceMultiplier));

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={t('market_expandMarket', { market: row.market })}
      accessibilityState={{ expanded }}
      style={[styles.row, row.isFoodBundles && styles.rowBest]}
    >
      <View style={styles.mainLine}>
        <View style={styles.marketCol}>
          <Text style={styles.marketName}>{row.market}</Text>
          {row.isFoodBundles ? (
            <View style={styles.bestBadgeWrap}>
              <Badge tone="leaf" label={t('market_bestPrice')} />
            </View>
          ) : null}
        </View>
        <Text style={styles.price}>{formatRwf(price)}</Text>
        <Text style={styles.stock}>{t(STOCK_KEY[row.stock])}</Text>
        <Sparkline values={row.trend} />
      </View>
      {expanded ? (
        <View style={styles.expanded}>
          <PriceAreaChart values={scaledValues} dayLabels={series.labels} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: color.paper,
    borderRadius: radius.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: color.hairline,
  },
  rowBest: { borderLeftWidth: 3, borderLeftColor: color.leaf },
  mainLine: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  marketCol: { flex: 1.4, gap: 2 },
  marketName: { ...text.bodySemi, color: color.ink },
  bestBadgeWrap: { alignSelf: 'flex-start' },
  price: { ...text.bodySemi, color: color.ink, flex: 1, textAlign: 'right', fontVariant: ['tabular-nums'] },
  stock: { ...text.caption, color: color.secondary, flex: 1, textAlign: 'right' },
  expanded: { marginTop: space.md, paddingTop: space.md, borderTopWidth: 1, borderTopColor: color.hairline },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { Badge } from '@/components/primitives';
import { Sparkline } from './Sparkline';
import { PriceAreaChart } from './PriceAreaChart';
import { useT } from '@/i18n';
import type { CommodityId, MarketComparisonRow as MarketComparisonRowData } from '@/api/market.api';

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

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

/** One row of the market comparison table; tapping expands a full chart for that market. */
export function MarketComparisonRow({ row, latestPrice, expanded, onToggle }: MarketComparisonRowProps) {
  const t = useT();
  const { colors } = useTheme();
  const price = Math.round(latestPrice * row.priceMultiplier);
  const scaledValues = row.trend.map((v) => Math.round(v * row.priceMultiplier));

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={t('market_expandMarket', { market: row.market })}
      accessibilityState={{ expanded }}
      style={[
        styles.row,
        { backgroundColor: colors.paper, borderColor: colors.hairline },
        row.isFoodBundles && { borderLeftWidth: 3, borderLeftColor: colors.leaf },
      ]}
    >
      <View style={styles.mainLine}>
        <View style={styles.marketCol}>
          <Text style={[styles.marketName, { color: colors.ink }]}>{row.market}</Text>
          {row.isFoodBundles ? (
            <View style={styles.bestBadgeWrap}>
              <Badge tone="leaf" label={t('market_bestPrice')} />
            </View>
          ) : null}
        </View>
        <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(price)}</Text>
        <Text style={[styles.stock, { color: colors.secondary }]}>{t(STOCK_KEY[row.stock])}</Text>
        <Sparkline values={row.trend} />
      </View>
      {expanded && scaledValues.length > 0 ? (
        <View style={[styles.expanded, { borderTopColor: colors.hairline }]}>
          <PriceAreaChart values={scaledValues} dayLabels={DAY_LABELS.slice(0, scaledValues.length)} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { borderRadius: radius.md, padding: space.md, borderWidth: 1 },
  mainLine: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  marketCol: { flex: 1.4, gap: 2 },
  marketName: { ...text.bodySemi },
  bestBadgeWrap: { alignSelf: 'flex-start' },
  price: { ...text.bodySemi, flex: 1, textAlign: 'right', fontVariant: ['tabular-nums'] },
  stock: { ...text.caption, flex: 1, textAlign: 'right' },
  expanded: { marginTop: space.md, paddingTop: space.md, borderTopWidth: 1 },
});

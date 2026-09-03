import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { ProductLineImage } from '@/components/product';
import { OrderVsMarketChart } from './OrderVsMarketChart';
import { formatRwf } from '@/lib';
import type { ItemComparison } from '@/lib';
import { products, ORDER_TIMING_INSIGHTS } from '@/mocks';
import { useT } from '@/i18n';

export interface ItemComparisonRowProps {
  item: ItemComparison;
}

/** One expandable per-item row: collapsed summary, expanded overlay chart, and a best-time-to-order insight. */
export function ItemComparisonRow({ item }: ItemComparisonRowProps) {
  const t = useT();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const product = products.find((p) => p.id === item.productId);
  const timing = ORDER_TIMING_INSIGHTS.find((i) => i.productId === item.productId);

  const kimironkoPct = item.vsMarketPct.Kimironko ?? 0;
  const isBelow = kimironkoPct <= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={item.name}
        style={styles.headerRow}
      >
        {product ? <ProductLineImage source={product.image} label={item.name} /> : null}
        <View style={styles.textCol}>
          <Text style={[styles.name, { color: colors.ink }]}>{item.name}</Text>
          <Text style={[styles.avgPaid, { color: colors.secondary }]}>
            {t('priceHistory_avgPaid', { price: formatRwf(item.avgPaid) })}
          </Text>
        </View>
        <Badge
          tone={isBelow ? 'ripe' : 'chili'}
          label={t('priceHistory_vsMarket', {
            sign: isBelow ? '−' : '+',
            percent: Math.abs(kimironkoPct).toFixed(1),
            market: 'Kimironko',
          })}
        />
      </Pressable>
      {expanded ? (
        <View style={styles.body}>
          <OrderVsMarketChart item={item} />
          {timing ? (
            <Text style={[styles.timing, { color: colors.secondary }]}>
              {t('priceHistory_bestTime', {
                name: item.name,
                cheapDay: timing.cheaperDay,
                cheapAvg: formatRwf(timing.cheaperDayAvg),
                pricyAvg: formatRwf(timing.pricierDayAvg),
                pricyDay: timing.pricierDay,
              })}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.md, marginBottom: space.sm, ...shadow.card },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  avgPaid: { ...text.caption, marginTop: 2 },
  body: { marginTop: space.md },
  timing: { ...text.caption, marginTop: space.sm },
});

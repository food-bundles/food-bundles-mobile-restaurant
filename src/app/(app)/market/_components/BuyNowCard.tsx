import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { QuantityStepper } from '@/components/product';
import { formatRwf } from '@/lib';
import { useCartStore, useMarketStore } from '@/stores';
import { COMMODITY_PRODUCT_ID, type BuyingAdviceItem } from '@/lib';
import { PRODUCT_IMAGES } from '@/constants/productImages';
import { useT } from '@/i18n';
import type { CommodityId } from '@/api/market.api';

export interface BuyNowCardProps {
  items: BuyingAdviceItem[];
  onFeedback: (message: string) => void;
}

const PHOTO_HEIGHT = 120;

const COMMODITY_IMAGE: Partial<Record<CommodityId, any>> = {
  irishPotatoes: PRODUCT_IMAGES.irishPotatoes,
  tomatoes: PRODUCT_IMAGES.freshTomatoes,
  redOnions: PRODUCT_IMAGES.redOnions,
  cabbage: PRODUCT_IMAGES.cabbage,
  carrots: PRODUCT_IMAGES.carrots,
};

/** Section A "Buy now": full-width vertical cards with a photo, savings badge, and 3-source price row. */
export function BuyNowCard({ items, onFeedback }: BuyNowCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const addToCart = useCartStore((state) => state.add);
  const incQty = useCartStore((state) => state.inc);
  const decQty = useCartStore((state) => state.dec);
  const cartLines = useCartStore((state) => state.lines);
  const seriesCache = useMarketStore((s) => s.seriesCache);
  const fetchSeries = useMarketStore((s) => s.fetchSeries);

  if (items.length === 0) return null;

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('advisor_buyNow')}</Text>
      {items.slice(0, 4).map((item) => {
        const productId = COMMODITY_PRODUCT_ID[item.commodityId];
        const image = COMMODITY_IMAGE[item.commodityId as CommodityId];
        const savePct = Math.abs(item.changeFraction * 100).toFixed(0);
        const comparison = seriesCache[`${item.commodityId}-7D`]?.comparison ?? [];
        const sourceRows = comparison.length > 0
          ? comparison.map((row) => ({ market: row.market, price: Math.round(item.todayPrice * row.priceMultiplier) }))
          : [{ market: 'All Markets', price: item.todayPrice }];
        const cheapestMarket = sourceRows.reduce((min, row) => (row.price < min.price ? row : min), sourceRows[0]);
        const qty = cartLines.find((line) => line.productId === productId)?.qty ?? 0;
        // Lazily fetch series for comparison data
        if (comparison.length === 0) void fetchSeries(item.commodityId as CommodityId, '7D');

        return (
          <View key={item.commodityId} style={[styles.card, { backgroundColor: colors.paper }]}>
            {image ? (
              <Image source={image} style={styles.photo} accessibilityLabel={item.name} resizeMode="cover" />
            ) : null}
            <View style={styles.body}>
              <View style={styles.headerRow}>
                <Text style={[styles.name, { color: colors.ink }]}>{item.name}</Text>
                <Badge tone="ripe" label={t('advisor_savePct', { percent: savePct })} />
              </View>
              <Text style={[styles.caption, { color: colors.secondary }]}>
                {t('advisor_today', { price: formatRwf(item.todayPrice) })} ·{' '}
                {t('advisor_weeklyAvg', { price: formatRwf(item.weeklyAveragePrice) })}
              </Text>
              <View style={styles.sourceRow}>
                {sourceRows.map((row) => (
                  <Text
                    key={row.market}
                    style={[
                      styles.sourceText,
                      { color: row.market === cheapestMarket.market ? colors.leaf : colors.secondary },
                    ]}
                  >
                    {row.market} {formatRwf(row.price)}
                  </Text>
                ))}
              </View>
              {qty > 0 ? (
                <View style={styles.stepperRow}>
                  <QuantityStepper qty={qty} onInc={() => incQty(productId)} onDec={() => decQty(productId)} />
                </View>
              ) : (
                <Pressable
                  onPress={() => { addToCart(productId); onFeedback(t('advisor_addedToCart', { name: item.name })); }}
                  accessibilityRole="button"
                  accessibilityLabel={t('advisor_addToCart')}
                  style={[styles.addButton, { backgroundColor: colors.marigold }]}
                >
                  <Text style={[styles.addLabel, { color: colors.pine }]}>{t('advisor_addToCart')}</Text>
                </Pressable>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  card: { borderRadius: radius.lg, marginBottom: space.sm, overflow: 'hidden', ...shadow.card },
  photo: { width: '100%', height: PHOTO_HEIGHT },
  body: { padding: space.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...text.bodySemi, flexShrink: 1 },
  caption: { ...text.caption, marginTop: space.xs },
  sourceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.sm },
  sourceText: { ...text.micro, fontVariant: ['tabular-nums'] },
  addButton: {
    minHeight: hit.min,
    borderRadius: radius.pill,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: space.md,
    alignSelf: 'flex-end',
    marginTop: space.sm,
  },
  addLabel: { ...text.bodySemi },
  stepperRow: { alignSelf: 'flex-end', marginTop: space.sm },
});

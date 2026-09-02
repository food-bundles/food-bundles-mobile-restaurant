import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { QuantityStepper } from '@/components/product';
import { formatRwf } from '@/lib';
import { useCartStore } from '@/stores';
import { COMMODITY_PRODUCT_ID, type BuyingAdviceItem } from '@/lib';
import { MARKET_COMPARISON, products } from '@/mocks';
import { useT } from '@/i18n';

export interface BuyNowCardProps {
  items: BuyingAdviceItem[];
  onFeedback: (message: string) => void;
}

const PHOTO_HEIGHT = 120;
const SOURCE_MARKETS = ['Kimironko', 'Musanze', 'FoodBundles'];

/** Section A "Buy now": full-width vertical cards with a photo, savings badge, and 3-source price row. */
export function BuyNowCard({ items, onFeedback }: BuyNowCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const addToCart = useCartStore((state) => state.add);
  const incQty = useCartStore((state) => state.inc);
  const decQty = useCartStore((state) => state.dec);
  const cartLines = useCartStore((state) => state.lines);

  if (items.length === 0) return null;

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('advisor_buyNow')}</Text>
      {items.slice(0, 4).map((item) => {
        const productId = COMMODITY_PRODUCT_ID[item.commodityId];
        const product = products.find((p) => p.id === productId);
        const savePct = Math.abs(item.changeFraction * 100).toFixed(0);
        const sourceRows = MARKET_COMPARISON.filter((row) => SOURCE_MARKETS.includes(row.market)).map((row) => ({
          market: row.market,
          price: Math.round(item.todayPrice * row.priceMultiplier),
        }));
        const cheapestMarket = sourceRows.reduce((min, row) => (row.price < min.price ? row : min), sourceRows[0]);
        const qty = cartLines.find((line) => line.productId === productId)?.qty ?? 0;

        return (
          <View key={item.commodityId} style={[styles.card, { backgroundColor: colors.paper }]}>
            {product ? (
              <Image source={product.image} style={styles.photo} accessibilityLabel={item.name} resizeMode="cover" />
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
                  <QuantityStepper
                    qty={qty}
                    onInc={() => incQty(productId)}
                    onDec={() => decQty(productId)}
                  />
                </View>
              ) : (
                <Pressable
                  onPress={() => {
                    addToCart(productId);
                    onFeedback(t('advisor_addedToCart', { name: item.name }));
                  }}
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

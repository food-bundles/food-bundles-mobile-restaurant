import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { AdviceRow } from './AdviceRow';
import { useCartStore } from '@/stores';
import { COMMODITY_PRODUCT_ID, type BuyingAdviceItem } from '@/lib';
import { useT } from '@/i18n';

export interface BuyNowCardProps {
  items: BuyingAdviceItem[];
}

/** Lists commodities priced well below their 7-day average, with a one-tap add-to-cart per row. */
export function BuyNowCard({ items }: BuyNowCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const addToCart = useCartStore((state) => state.add);

  if (items.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('advisor_buyNow')}</Text>
      {items.slice(0, 4).map((item) => (
        <AdviceRow
          key={item.commodityId}
          item={item}
          productId={COMMODITY_PRODUCT_ID[item.commodityId]}
          onAction={() => addToCart(COMMODITY_PRODUCT_ID[item.commodityId])}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: radius.lg,
    padding: space.md,
    marginRight: space.sm,
    ...shadow.card,
  },
  title: { ...text.overline },
});

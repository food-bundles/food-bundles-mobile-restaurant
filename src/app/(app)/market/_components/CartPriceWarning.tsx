import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useCartStore } from '@/stores';
import { COMMODITY_PRODUCT_ID, type BuyingAdviceItem } from '@/lib';
import { useT } from '@/i18n';

export interface CartPriceWarningProps {
  waitItems: BuyingAdviceItem[];
}

/** Warns when a cart item is on today's "wait" list, so the restaurant can defer that purchase. */
export function CartPriceWarning({ waitItems }: CartPriceWarningProps) {
  const t = useT();
  const { colors } = useTheme();
  const cartLines = useCartStore((state) => state.lines);

  const flagged = waitItems.find((item) =>
    cartLines.some((line) => line.productId === COMMODITY_PRODUCT_ID[item.commodityId]),
  );
  if (!flagged) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.tintChili }]}>
      <Text style={[styles.title, { color: colors.tintedRedText }]}>{t('advisor_cartWarningTitle')}</Text>
      <Text style={[styles.body, { color: colors.tintedRedText }]}>
        {t('advisor_cartWarningBody', { name: flagged.name })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, padding: space.md, marginTop: space.lg },
  title: { ...text.bodySemi },
  body: { ...text.caption, marginTop: space.xs },
});

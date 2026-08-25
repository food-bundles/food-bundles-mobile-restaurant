import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useCartStore } from '@/stores';
import { COMMODITY_PRODUCT_ID, type BuyingAdviceItem } from '@/lib';
import { useT } from '@/i18n';

export interface CartPriceWarningProps {
  waitItems: BuyingAdviceItem[];
}

/** Section D "Your cart risk": warns when a cart item is on today's "wait" list, with a link to review it. */
export function CartPriceWarning({ waitItems }: CartPriceWarningProps) {
  const t = useT();
  const { colors } = useTheme();
  const cartLines = useCartStore((state) => state.lines);

  const flagged = waitItems.filter((item) =>
    cartLines.some((line) => line.productId === COMMODITY_PRODUCT_ID[item.commodityId]),
  );
  if (flagged.length === 0) return null;

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('advisor_cartRiskTitle')}</Text>
      <View style={[styles.card, { backgroundColor: colors.tintMarigold }]}>
        <Text style={[styles.title, { color: colors.tintedAmberText }]}>{t('advisor_cartWarningTitle')}</Text>
        {flagged.map((item) => (
          <Text key={item.commodityId} style={[styles.body, { color: colors.tintedAmberText }]}>
            {t('advisor_cartWarningBody', { name: item.name })}
          </Text>
        ))}
        <Pressable
          onPress={() => router.push('/(app)/shop/cart')}
          accessibilityRole="button"
          accessibilityLabel={t('advisor_reviewCart')}
          style={styles.reviewHit}
        >
          <Text style={[styles.reviewLabel, { color: colors.tintedAmberText }]}>{t('advisor_reviewCart')} →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  card: { borderRadius: radius.md, padding: space.md },
  title: { ...text.bodySemi },
  body: { ...text.caption, marginTop: space.xs },
  reviewHit: { minHeight: hit.min, justifyContent: 'center', marginTop: space.xs },
  reviewLabel: { ...text.label },
});

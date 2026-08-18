import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { PriceText } from '@/components/product';
import { useCartStore } from '@/stores';
import { useT } from '@/i18n';

const DELIVERY_FEE = 3000;

export function CartTotalsCard() {
  const t = useT();
  const { colors } = useTheme();
  const subtotal = useCartStore((state) => state.subtotal());
  const total = subtotal + DELIVERY_FEE;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.body }]}>{t('shop_subtotal')}</Text>
        <PriceText amount={subtotal} size="md" />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.body }]}>{t('shop_delivery')}</Text>
        <PriceText amount={DELIVERY_FEE} size="md" />
      </View>
      <View style={[styles.row, styles.totalRow, { borderTopColor: colors.hairline }]}>
        <Text style={[styles.totalLabel, { color: colors.ink }]}>{t('shop_total')}</Text>
        <PriceText amount={total} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.xs,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...text.caption },
  totalRow: { marginTop: space.xs, paddingTop: space.sm, borderTopWidth: 1 },
  totalLabel: { ...text.bodySemi },
});

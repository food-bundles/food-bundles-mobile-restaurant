import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { PriceText } from '@/components/product';
import { useCartStore } from '@/stores';
import { useT } from '@/i18n';

const DELIVERY_FEE = 3000;

export function CartTotalsCard() {
  const t = useT();
  const subtotal = useCartStore((state) => state.subtotal());
  const total = subtotal + DELIVERY_FEE;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('shop_subtotal')}</Text>
        <PriceText amount={subtotal} size="md" />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('shop_delivery')}</Text>
        <PriceText amount={DELIVERY_FEE} size="md" />
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>{t('shop_total')}</Text>
        <PriceText amount={total} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.xs,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...text.caption, color: color.body },
  totalRow: { marginTop: space.xs, paddingTop: space.sm, borderTopWidth: 1, borderTopColor: color.hairline },
  totalLabel: { ...text.bodySemi, color: color.ink },
});

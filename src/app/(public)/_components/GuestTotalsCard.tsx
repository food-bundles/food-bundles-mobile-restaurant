import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { PriceText } from '@/components/product';
import { useGuestCartStore } from '@/stores';
import { useT } from '@/i18n';

export function GuestTotalsCard() {
  const t = useT();
  const subtotal = useGuestCartStore((state) => state.subtotal());
  const deliveryFee = useGuestCartStore((state) => state.deliveryFee());
  const total = useGuestCartStore((state) => state.total());

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('guest_subtotal')}</Text>
        <PriceText amount={subtotal} size="md" />
      </View>
      {deliveryFee > 0 ? (
        <View style={styles.row}>
          <Text style={styles.feeNote}>{t('guest_smallOrderFee')}</Text>
          <PriceText amount={deliveryFee} size="md" />
        </View>
      ) : null}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>{t('guest_total')}</Text>
        <PriceText amount={total} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.hairline,
    padding: space.lg,
    gap: space.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { ...text.body, color: color.body },
  feeNote: { ...text.caption, color: color.tintedAmberText },
  totalRow: { marginTop: space.sm, paddingTop: space.sm, borderTopWidth: 1, borderTopColor: color.hairline },
  totalLabel: { ...text.bodySemi, color: color.ink },
});

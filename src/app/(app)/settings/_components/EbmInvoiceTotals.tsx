import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

const VAT_RATE = 0.18;

export interface EbmInvoiceTotalsProps {
  order: Order;
}

export function EbmInvoiceTotals({ order }: EbmInvoiceTotalsProps) {
  const t = useT();
  const { colors } = useTheme();
  const vatIncluded = Math.round((order.subtotal * VAT_RATE) / (1 + VAT_RATE));

  return (
    <View style={[styles.card, { borderTopColor: colors.hairline }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.secondary }]}>{t('shop_subtotal')}</Text>
        <Text style={[styles.value, { color: colors.ink }]}>{formatRwf(order.subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.secondary }]}>{t('shop_delivery')}</Text>
        <Text style={[styles.value, { color: colors.ink }]}>{formatRwf(order.deliveryFee)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.secondary }]}>{t('ebm_vatIncluded')}</Text>
        <Text style={[styles.value, { color: colors.ink }]}>{formatRwf(vatIncluded)}</Text>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={[styles.totalLabel, { color: colors.ink }]}>{t('shop_total')}</Text>
        <Text style={[styles.totalValue, { color: colors.ink }]}>{formatRwf(order.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: space.md, borderTopWidth: 1, paddingTop: space.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  label: { ...text.caption },
  value: { ...text.caption, fontVariant: ['tabular-nums'] },
  totalRow: { marginTop: space.xs },
  totalLabel: { ...text.bodySemi },
  totalValue: { ...text.bodySemi, fontVariant: ['tabular-nums'] },
});

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
  const taxableBase = order.subtotal - vatIncluded;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.secondary }]}>{t('shop_delivery')}</Text>
        <Text style={[styles.value, { color: colors.ink }]}>{formatRwf(order.deliveryFee)}</Text>
      </View>
      <View style={[styles.taxSummary, { borderColor: colors.hairline }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.secondary }]}>{t('ebm_totalTaxCode', { code: 'B', rate: 18 })}</Text>
          <Text style={[styles.value, { color: colors.ink }]}>{formatRwf(taxableBase)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.secondary }]}>{t('ebm_totalTax')}</Text>
          <Text style={[styles.value, { color: colors.ink }]}>{formatRwf(vatIncluded)}</Text>
        </View>
      </View>
      <View style={[styles.row, styles.totalRow, { borderTopColor: colors.hairline }]}>
        <Text style={[styles.totalLabel, { color: colors.ink }]}>{t('ebm_totalRwf')}</Text>
        <Text style={[styles.totalValue, { color: colors.ink }]}>{formatRwf(order.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  label: { ...text.caption },
  value: { ...text.caption, fontVariant: ['tabular-nums'] },
  taxSummary: {
    marginTop: 2,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    paddingTop: space.xs,
  },
  totalRow: { marginTop: space.xs, borderTopWidth: 1, paddingTop: space.xs },
  totalLabel: { ...text.bodySemi },
  totalValue: { ...text.bodySemi, fontVariant: ['tabular-nums'] },
});

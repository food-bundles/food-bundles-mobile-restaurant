import { StyleSheet, Text, View } from 'react-native';
import { color, space, text } from '@/theme';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

const VAT_RATE = 0.18;

export interface EbmInvoiceTotalsProps {
  order: Order;
}

export function EbmInvoiceTotals({ order }: EbmInvoiceTotalsProps) {
  const t = useT();
  const vatIncluded = Math.round((order.subtotal * VAT_RATE) / (1 + VAT_RATE));

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('shop_subtotal')}</Text>
        <Text style={styles.value}>{formatRwf(order.subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('shop_delivery')}</Text>
        <Text style={styles.value}>{formatRwf(order.deliveryFee)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('ebm_vatIncluded')}</Text>
        <Text style={styles.value}>{formatRwf(vatIncluded)}</Text>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>{t('shop_total')}</Text>
        <Text style={styles.totalValue}>{formatRwf(order.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: space.md, borderTopWidth: 1, borderTopColor: color.hairline, paddingTop: space.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  label: { ...text.caption, color: color.secondary },
  value: { ...text.caption, color: color.ink, fontVariant: ['tabular-nums'] },
  totalRow: { marginTop: space.xs },
  totalLabel: { ...text.bodySemi, color: color.ink },
  totalValue: { ...text.bodySemi, color: color.ink, fontVariant: ['tabular-nums'] },
});

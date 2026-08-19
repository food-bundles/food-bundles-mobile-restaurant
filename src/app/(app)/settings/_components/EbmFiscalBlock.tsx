import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { formatDate, formatTime } from '@/lib';
import { useT } from '@/i18n';
import { deriveFiscalIds } from './ebmFiscalIds';
import type { Order } from '@/mocks/types';

export interface EbmFiscalBlockProps {
  order: Order;
}

export function EbmFiscalBlock({ order }: EbmFiscalBlockProps) {
  const t = useT();
  const { colors } = useTheme();
  const { sdcId, receiptNo, invoiceNo } = deriveFiscalIds(order.id);

  const rows: [string, string][] = [
    [t('ebm_sdcId'), sdcId],
    [t('ebm_receiptNo'), receiptNo],
    [t('ebm_invoiceNo'), invoiceNo],
    [t('ebm_date'), `${formatDate(order.placedAt)}  ${formatTime(order.placedAt)}`],
  ];

  return (
    <View style={[styles.card, { borderColor: colors.hairline }]}>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
          <Text style={[styles.value, { color: colors.ink }]}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: space.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    paddingVertical: space.sm,
    gap: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...text.caption },
  value: { ...text.caption, fontVariant: ['tabular-nums'] },
});

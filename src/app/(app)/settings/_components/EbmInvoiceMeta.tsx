import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { formatDate, formatTime } from '@/lib';
import { useT } from '@/i18n';
import { account } from '@/mocks';
import type { Order } from '@/mocks/types';

export interface EbmInvoiceMetaProps {
  order: Order;
}

export function EbmInvoiceMeta({ order }: EbmInvoiceMetaProps) {
  const t = useT();
  const { colors } = useTheme();
  const invoiceNo = `EBM-${order.id.replace('FB-', '')}-01`;

  const rows: [string, string][] = [
    [t('ebm_invoiceNo'), invoiceNo],
    [t('ebm_order'), order.id],
    [t('ebm_date'), `${formatDate(order.placedAt)} · ${formatTime(order.placedAt)}`],
    [t('ebm_customer'), account.businessName],
    [t('ebm_customerTin'), account.tin],
  ];

  return (
    <View style={styles.card}>
      {rows.map(([label, value], index) => (
        <View key={label} style={styles.row}>
          <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
          <Text
            style={[
              styles.value,
              { color: colors.ink },
              index === 0 && [styles.valueAccent, { color: colors.leaf }],
            ]}
          >
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  label: { ...text.caption },
  value: { ...text.caption },
  valueAccent: { ...text.bodySemi },
});

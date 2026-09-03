import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { formatTin } from '@/lib';
import { useT } from '@/i18n';
import { account } from '@/mocks';
import type { Order } from '@/mocks/types';

export interface EbmInvoiceMetaProps {
  order: Order;
}

export function EbmInvoiceMeta({ order }: EbmInvoiceMetaProps) {
  const t = useT();
  const { colors } = useTheme();

  const rows: [string, string][] = [
    [t('ebm_order'), order.id],
    [t('ebm_customer'), account.businessName],
    [t('ebm_customerTin'), formatTin(account.tin)],
  ];

  return (
    <View style={styles.card}>
      <Text style={[styles.heading, { color: colors.secondary }]}>{t('ebm_buyer')}</Text>
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
  card: { marginTop: space.md, gap: 3 },
  heading: { ...text.overline, marginBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 1 },
  label: { ...text.caption },
  value: { ...text.caption },
});

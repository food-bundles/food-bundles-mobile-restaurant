import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { PriceText } from '@/components/product';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

export interface OrderMetaCardProps {
  order: Order;
}

export function OrderMetaCard({ order }: OrderMetaCardProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.secondary }]}>{t('orders_deliverTo')}</Text>
        <Text style={[styles.value, { color: colors.ink }]}>{order.address}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.secondary }]}>{t('orders_window')}</Text>
        <Text style={[styles.value, { color: colors.ink }]}>{order.window}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.secondary }]}>{t('orders_total')}</Text>
        <PriceText amount={order.total} size="md" />
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...text.caption },
  value: { ...text.label },
});

import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { PriceText } from '@/components/product';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

export interface OrderMetaCardProps {
  order: Order;
}

export function OrderMetaCard({ order }: OrderMetaCardProps) {
  const t = useT();

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('orders_deliverTo')}</Text>
        <Text style={styles.value}>{order.address}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('orders_window')}</Text>
        <Text style={styles.value}>{order.window}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('orders_total')}</Text>
        <PriceText amount={order.total} size="md" />
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...text.caption, color: color.secondary },
  value: { ...text.label, color: color.ink },
});

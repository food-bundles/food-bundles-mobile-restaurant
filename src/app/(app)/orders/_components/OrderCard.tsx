import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { OrderProgressTrack, OrderStatusBadge } from '@/components/order';
import { PriceText } from '@/components/product';
import { formatDate } from '@/lib';
import type { Order } from '@/mocks/types';

export interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const itemSummary = order.lines.map((line) => line.name).join(', ');

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/(app)/orders/[id]', params: { id: order.id } })}
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.id}, ${order.status}`}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <Text style={styles.id}>{order.id}</Text>
        <OrderStatusBadge status={order.status} />
      </View>
      <Text style={styles.date}>{formatDate(order.placedAt)}</Text>
      <View style={styles.summaryRow}>
        <Text style={styles.summary} numberOfLines={1}>
          {itemSummary}
        </Text>
        <PriceText amount={order.total} size="md" />
      </View>
      {order.step > 0 ? <OrderProgressTrack step={order.step} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { ...text.bodySemi, color: color.ink },
  date: { ...text.caption, color: color.secondary, marginTop: 2, marginBottom: space.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.sm },
  summary: { ...text.body, color: color.body, flex: 1, marginRight: space.sm },
});

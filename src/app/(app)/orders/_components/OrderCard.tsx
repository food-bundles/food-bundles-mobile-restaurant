import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { OrderProgressTrack, OrderStatusBadge } from '@/components/order';
import { PriceText } from '@/components/product';
import { formatDate } from '@/lib';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import type { Order } from '@/mocks/types';

const STATUS_KEY: Record<string, TranslationKey> = {
  PENDING: 'st_pending',
  CONFIRMED: 'st_confirmed',
  PREPARING: 'st_preparing',
  READY: 'st_ready',
  IN_TRANSIT: 'st_intransit',
  DELIVERED: 'st_delivered',
  CANCELLED: 'st_cancelled',
  REFUNDED: 'st_refunded',
};

export interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const itemSummary = order.lines.map((line) => line.name).join(', ');

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/(app)/orders/[id]', params: { id: order.id } })}
      accessibilityRole="button"
      accessibilityLabel={t('a11y_orderCard', {
        orderId: order.id,
        status: t(STATUS_KEY[order.status] ?? 'st_pending'),
      })}
      style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.id, { color: colors.ink }]}>{order.id}</Text>
        <OrderStatusBadge status={order.status} />
      </View>
      <Text style={[styles.date, { color: colors.secondary }]}>{formatDate(order.placedAt)}</Text>
      <View style={styles.summaryRow}>
        <Text style={[styles.summary, { color: colors.body }]} numberOfLines={1}>
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
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { ...text.bodySemi },
  date: { ...text.caption, marginTop: 2, marginBottom: space.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.sm },
  summary: { ...text.body, flex: 1, marginRight: space.sm },
});

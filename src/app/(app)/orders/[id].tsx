import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { OrderStatusRail, OrderStatusBadge, OrderItemsCard } from '@/components/order';
import { OrderMetaCard } from './_components/OrderMetaCard';
import { OrderActionsRow } from './_components/OrderActionsRow';
import { orders } from '@/mocks';
import { useT } from '@/i18n';

export default function OrderDetail() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useMemo(() => orders.find((o) => o.id === id), [id]);

  if (!order) return null;

  return (
    <View style={styles.container}>
      <ScreenHeader title={order.id} trailing={<OrderStatusBadge status={order.status} />} />
      <ScreenScroll contentInsetBottom={40}>
        {order.step > 0 ? (
          <View style={styles.railCard}>
            <OrderStatusRail step={order.step} />
          </View>
        ) : null}
        <View style={styles.metaGap}>
          <OrderMetaCard order={order} />
        </View>
        <View style={styles.itemsGap}>
          <OrderItemsCard lines={order.lines} title={t('orders_items')} showCount={false} />
        </View>
        <View style={styles.actionsGap}>
          <OrderActionsRow ebmAvailable={order.ebmAvailable} />
        </View>
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/orders/reorder', params: { id: order.id } })}
          accessibilityRole="button"
          accessibilityLabel={t('orders_reorderBtn')}
          style={styles.reorderButton}
        >
          <Text style={styles.reorderLabel}>{t('orders_reorderBtn')}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(app)/support/chat')}
          accessibilityRole="button"
          accessibilityLabel={t('orders_contactSupport')}
          style={styles.supportButton}
        >
          <Text style={styles.supportLabel}>{t('orders_contactSupport')}</Text>
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  railCard: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.md,
  },
  metaGap: { marginTop: space.md },
  itemsGap: { marginTop: space.md },
  actionsGap: { marginTop: space.md },
  reorderButton: {
    minHeight: 44,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  reorderLabel: { ...text.bodySemi, color: color.paper },
  supportButton: {
    minHeight: 44,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  supportLabel: { ...text.bodySemi, color: color.leaf },
});

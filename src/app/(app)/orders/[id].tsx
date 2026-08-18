import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { OrderStatusRail, OrderStatusBadge, OrderItemsCard } from '@/components/order';
import { OrderMetaCard } from './_components/OrderMetaCard';
import { OrderActionsRow } from './_components/OrderActionsRow';
import { orders } from '@/mocks';
import { useT } from '@/i18n';

export default function OrderDetail() {
  const t = useT();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useMemo(() => orders.find((o) => o.id === id), [id]);

  if (!order) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={order.id} trailing={<OrderStatusBadge status={order.status} />} />
      <ScreenScroll contentInsetBottom={40}>
        {order.step > 0 ? (
          <View style={[styles.railCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
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
          style={[styles.reorderButton, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.reorderLabel, { color: colors.paper }]}>{t('orders_reorderBtn')}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(app)/support/chat')}
          accessibilityRole="button"
          accessibilityLabel={t('orders_contactSupport')}
          style={[styles.supportButton, { backgroundColor: colors.paper, borderColor: colors.leaf }]}
        >
          <Text style={[styles.supportLabel, { color: colors.leaf }]}>{t('orders_contactSupport')}</Text>
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  railCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.md,
  },
  metaGap: { marginTop: space.md },
  itemsGap: { marginTop: space.md },
  actionsGap: { marginTop: space.md },
  reorderButton: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  reorderLabel: { ...text.bodySemi },
  supportButton: {
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  supportLabel: { ...text.bodySemi },
});

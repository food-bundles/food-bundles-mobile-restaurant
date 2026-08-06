import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, space, text } from '@/theme';
import { EmptyState, ErrorState } from '@/components/primitives';
import { DemoStateToggle } from '../orders/_components/DemoStateToggle';
import { ActiveOrderCard } from '../orders/_components/ActiveOrderCard';
import { OrderFilterChips, type OrderFilter } from '../orders/_components/OrderFilterChips';
import { OrderCard } from '../orders/_components/OrderCard';
import { OrderCardSkeleton } from '../orders/_components/OrderCardSkeleton';
import { orders as seedOrders } from '@/mocks';
import { useUiStore } from '@/stores';
import { useT } from '@/i18n';
import { OrdersIcon } from '@/components/icons';

export default function OrdersList() {
  const t = useT();
  const demoState = useUiStore((state) => state.ordersDemoState);
  const setDemoState = useUiStore((state) => state.setOrdersDemoState);
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (demoState === 'loading') {
      const timer = setTimeout(() => setDemoState('live'), 1200);
      return () => clearTimeout(timer);
    }
  }, [demoState, setDemoState]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  const activeOrder = seedOrders.find((order) => order.step > 0 && order.step < 6);
  const filteredOrders = seedOrders.filter((order) => {
    if (filter === 'active') return order.step > 0 && order.step < 6;
    if (filter === 'past') return order.step === 0 || order.step === 6;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('orders_title')}</Text>
        <DemoStateToggle selected={demoState} onSelect={setDemoState} />
      </View>
      {demoState === 'loading' ? (
        <ScrollView contentContainerStyle={styles.listContent}>
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton faded />
        </ScrollView>
      ) : demoState === 'empty' ? (
        <View style={styles.centerContent}>
          <EmptyState
            icon={<OrdersIcon size={22} color={color.leaf} />}
            title={t('orders_emptyTitle')}
            message={t('orders_emptySub')}
            action={{ label: t('orders_browseProduce'), onPress: () => router.push('/(app)/(tabs)') }}
          />
        </View>
      ) : demoState === 'error' ? (
        <View style={styles.centerContent}>
          <ErrorState
            title={t('orders_errorTitle')}
            message={t('orders_errorSub')}
            onRetry={() => setDemoState('loading')}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color.leaf} />}
        >
          {activeOrder ? (
            <View style={styles.activeGap}>
              <ActiveOrderCard order={activeOrder} />
            </View>
          ) : null}
          <View style={styles.filterGap}>
            <OrderFilterChips selected={filter} onSelect={setFilter} />
          </View>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  header: { paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.sm },
  title: { ...text.h1, color: color.ink, marginBottom: space.sm },
  listContent: { paddingHorizontal: space.lg, paddingBottom: space.xl },
  centerContent: { flex: 1, justifyContent: 'center' },
  activeGap: { marginBottom: space.sm },
  filterGap: { marginBottom: space.sm },
});

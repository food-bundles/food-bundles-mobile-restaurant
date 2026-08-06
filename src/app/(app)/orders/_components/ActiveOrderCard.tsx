import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { OrderProgressTrack } from '@/components/order';
import { PriceText } from '@/components/product';
import type { Order } from '@/mocks/types';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const STATUS_KEY: Record<string, TranslationKey> = {
  PENDING: 'st_pending',
  CONFIRMED: 'st_confirmed',
  PREPARING: 'st_preparing',
  READY: 'st_ready',
  IN_TRANSIT: 'st_intransit',
  DELIVERED: 'st_delivered',
};

export interface ActiveOrderCardProps {
  order: Order;
}

export function ActiveOrderCard({ order }: ActiveOrderCardProps) {
  const t = useT();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/(app)/orders/[id]', params: { id: order.id } })}
      accessibilityRole="button"
      accessibilityLabel={`Active order ${order.id}, ${order.status}`}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <Text style={styles.id}>{order.id}</Text>
        <Text style={styles.status}>{t(STATUS_KEY[order.status] ?? 'st_pending')}</Text>
      </View>
      <PriceText amount={order.total} size="lg" colorOverride={color.paper} />
      <View style={styles.trackGap}>
        <OrderProgressTrack step={order.step} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.pine, borderRadius: radius.lg, padding: space.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.sm },
  id: { ...text.bodySemi, color: color.paper },
  status: { ...text.label, color: color.marigold },
  trackGap: { marginTop: space.md },
});

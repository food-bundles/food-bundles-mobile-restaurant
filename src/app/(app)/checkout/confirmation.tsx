import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { PriceText } from '@/components/product';
import { OrderStatusBadge } from '@/components/order';
import { ConfirmationCheck } from '@/components/checkout';
import { OrderItemsCard } from './_components/OrderItemsCard';
import { useCartStore, useCheckoutStore } from '@/stores';
import { useT } from '@/i18n';
import { orders } from '@/mocks';

const PAYMENT_LABELS: Record<string, string> = {
  MOBILE_MONEY: 'Mobile Money',
  CARD: 'Card',
  CASH: 'Prepaid wallet',
  VOUCHER: 'Voucher credit',
};

export default function CheckoutConfirmation() {
  const t = useT();
  const method = useCheckoutStore((state) => state.method);
  const activeOrder = orders.find((order) => order.id === 'FB-24815') ?? orders[0];

  const onTrackOrder = () => {
    useCartStore.getState().clear();
    router.replace({ pathname: '/(app)/orders/[id]', params: { id: activeOrder.id } });
  };

  const onContinueShopping = () => {
    useCartStore.getState().clear();
    router.replace('/(app)/(tabs)');
  };

  return (
    <ScreenScroll>
      <View style={styles.headerRow}>
        <ConfirmationCheck />
        <View style={styles.headerText}>
          <Text style={styles.title}>{t('checkout_orderPlaced')}</Text>
          <Text style={styles.subtitle}>{t('checkout_confirmSub')}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.orderRef}>Order {activeOrder.id}</Text>
          <OrderStatusBadge status="PENDING" />
        </View>
        <View style={styles.priceGap}>
          <PriceText amount={activeOrder.total} size="hero" colorOverride={color.paper} />
        </View>
        <View style={styles.divider} />
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{t('checkout_itemsCount', { count: activeOrder.lines.length })}</Text>
          <Text style={styles.metaText}>{t('checkout_paidVia', { method: PAYMENT_LABELS[method] })}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{t('shop_delivery')}</Text>
          <Text style={styles.metaTextBold}>{t('checkout_deliveryLine')}</Text>
        </View>
      </View>
      <View style={styles.itemsGap}>
        <OrderItemsCard lines={activeOrder.lines} />
      </View>
      <Pressable
        onPress={onTrackOrder}
        accessibilityRole="button"
        accessibilityLabel={t('checkout_trackOrder')}
        style={styles.trackButton}
      >
        <Text style={styles.trackLabel}>{t('checkout_trackOrder')}</Text>
      </Pressable>
      <Pressable
        onPress={onContinueShopping}
        accessibilityRole="button"
        accessibilityLabel={t('checkout_continueShopping')}
        style={styles.continueButton}
      >
        <Text style={styles.continueLabel}>{t('checkout_continueShopping')}</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.lg },
  headerText: { flex: 1 },
  title: { ...text.h1, color: color.ink },
  subtitle: { ...text.caption, color: color.secondary, marginTop: space.xs },
  card: {
    backgroundColor: color.pine,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.lg,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderRef: { ...text.caption, color: color.onPine },
  priceGap: { marginTop: space.sm },
  divider: { height: 1, backgroundColor: color.onPine, opacity: 0.15, marginVertical: space.md },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.xs },
  metaText: { ...text.caption, color: color.onPineSoft },
  metaTextBold: { ...text.label, color: color.paper },
  itemsGap: { marginTop: space.md },
  trackButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  trackLabel: { ...text.bodySemi, color: color.paper },
  continueButton: {
    minHeight: 48,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  continueLabel: { ...text.bodySemi, color: color.leaf },
});

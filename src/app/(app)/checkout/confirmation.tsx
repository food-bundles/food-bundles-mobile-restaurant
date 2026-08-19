import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { PriceText } from '@/components/product';
import { OrderStatusBadge, OrderItemsCard } from '@/components/order';
import { ConfirmationCheck } from '@/components/checkout';
import { useCartStore, useCheckoutStore } from '@/stores';
import { useT } from '@/i18n';
import { orders } from '@/mocks';

const PAYMENT_LABELS: Record<string, string> = {
  MOBILE_MONEY: 'Mobile Money',
  CARD: 'Card',
  CASH: 'Prepaid wallet',
  VOUCHER: 'Voucher',
};

export default function CheckoutConfirmation() {
  const t = useT();
  const { colors } = useTheme();
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
          <Text style={[styles.title, { color: colors.ink }]}>{t('checkout_orderPlaced')}</Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>{t('checkout_confirmSub')}</Text>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: colors.pine }]}>
        <View style={styles.cardTopRow}>
          <Text style={[styles.orderRef, { color: colors.onPine }]}>Order {activeOrder.id}</Text>
          <OrderStatusBadge status="PENDING" />
        </View>
        <View style={styles.priceGap}>
          <PriceText amount={activeOrder.total} size="hero" colorOverride={colors.paper} />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.onPine }]} />
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.onPineSoft }]}>
            {t('checkout_itemsCount', { count: activeOrder.lines.length })}
          </Text>
          <Text style={[styles.metaText, { color: colors.onPineSoft }]}>
            {t('checkout_paidVia', { method: PAYMENT_LABELS[method] })}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.onPineSoft }]}>{t('shop_delivery')}</Text>
          <Text style={[styles.metaTextBold, { color: colors.paper }]}>{t('checkout_deliveryLine')}</Text>
        </View>
      </View>
      <View style={styles.itemsGap}>
        <OrderItemsCard lines={activeOrder.lines} />
      </View>
      <Pressable
        onPress={onTrackOrder}
        accessibilityRole="button"
        accessibilityLabel={t('checkout_trackOrder')}
        style={[styles.trackButton, { backgroundColor: colors.leaf }]}
      >
        <Text style={[styles.trackLabel, { color: colors.paper }]}>{t('checkout_trackOrder')}</Text>
      </Pressable>
      <Pressable
        onPress={onContinueShopping}
        accessibilityRole="button"
        accessibilityLabel={t('checkout_continueShopping')}
        style={[styles.continueButton, { backgroundColor: colors.paper, borderColor: colors.leaf }]}
      >
        <Text style={[styles.continueLabel, { color: colors.leaf }]}>{t('checkout_continueShopping')}</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.lg },
  headerText: { flex: 1 },
  title: { ...text.h1 },
  subtitle: { ...text.caption, marginTop: space.xs },
  card: {
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.lg,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderRef: { ...text.caption },
  priceGap: { marginTop: space.sm },
  divider: { height: 1, opacity: 0.15, marginVertical: space.md },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.xs },
  metaText: { ...text.caption },
  metaTextBold: { ...text.label },
  itemsGap: { marginTop: space.md },
  trackButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  trackLabel: { ...text.bodySemi },
  continueButton: {
    minHeight: 48,
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  continueLabel: { ...text.bodySemi },
});

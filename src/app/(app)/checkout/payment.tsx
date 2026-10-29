import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { PaymentMethodPicker } from './_components/PaymentMethodPicker';
import { OrderItemsCard } from '@/components/order';
import { CheckoutStepHeader } from '@/components/checkout';
import { PriceText } from '@/components/product';
import { useCheckoutStore, useCartStore, useWalletStore } from '@/stores';
import { scheduleLocalNotification } from '@/services/notificationService';
import { useT, translate } from '@/i18n';
import { formatRwf } from '@/lib';
import { getDeliveryFeeApi } from '@/api/config.api';

const LOW_BALANCE_THRESHOLD_RWF = 20_000;
const DEFAULT_DELIVERY_FEE = 3000;

/** Checkout payment step: choose a method and confirm, routing to the voucher or OTP flow as needed. */
export default function CheckoutPayment() {
  const t = useT();
  const { colors } = useTheme();
  const method = useCheckoutStore((state) => state.method);
  const address = useCheckoutStore((state) => state.address);
  const phone = useCheckoutStore((state) => state.phone);
  const cartId = useCheckoutStore((state) => state.cartId);
  const initiateCheckout = useCheckoutStore((state) => state.initiateCheckout);
  const walletBalance = useWalletStore((state) => state.balance);
  const lines = useCartStore((state) => state.lines);
  const subtotal = useCartStore((state) => state.subtotal());
  const [deliveryFee, setDeliveryFee] = useState(DEFAULT_DELIVERY_FEE);
  const total = subtotal + deliveryFee;
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getDeliveryFeeApi().then(setDeliveryFee).catch(() => {});
  }, []);
  const [error, setError] = useState<string | null>(null);

  // Map CartLine[] to OrderLine[] shape for display
  const orderLines = lines.map((l) => ({
    productId: l.productId,
    name: l.name ?? l.productId,
    unit: l.unit ?? '',
    qty: l.qty,
    each: l.unitPrice ?? 0,
  }));

  const onPayNow = async () => {
    if (method === 'VOUCHER') {
      router.push('/(app)/checkout/voucher');
      return;
    }
    if (method === 'CASH' && walletBalance - total < LOW_BALANCE_THRESHOLD_RWF) {
      await scheduleLocalNotification({
        channel: 'wallet',
        title: translate('notif_lowWalletBalance'),
        body: translate('notif_lowWalletBalanceBody'),
        deepLink: '/(app)/(tabs)/wallet',
        actionLabel: translate('wallet_topUp'),
      });
    }
    if (!cartId) {
      setError('Cart not found. Please go back and try again.');
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const requiresOtp = await initiateCheckout({
        cartId,
        paymentMethodId: method,
        deliveryAddress: address,
        phoneNumber: phone || undefined,
      });
      if (requiresOtp) {
        router.push('/(app)/checkout/otp');
      } else {
        router.replace('/(app)/checkout/confirmation');
      }
    } catch (err: any) {
      setError(err.message ?? 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <CheckoutStepHeader title={t('checkout_payment')} step={2} />
      <ScreenScroll contentInsetBottom={80} applyTopInset={false}>
        <View style={[styles.totalCard, { backgroundColor: colors.pine }]}>
          <Text style={[styles.totalLabel, { color: colors.onPine }]}>{t('checkout_orderTotal')}</Text>
          <PriceText amount={total} size="md" colorOverride={colors.paper} />
        </View>
        <View style={styles.tilesGap}>
          <PaymentMethodPicker />
        </View>
        {orderLines.length > 0 && (
          <View style={styles.itemsGap}>
            <OrderItemsCard lines={orderLines} />
          </View>
        )}
        {error ? <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text> : null}
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onPayNow}
          disabled={processing}
          accessibilityRole="button"
          accessibilityLabel={processing ? t('checkout_processingPayment') : t('checkout_pay', { amount: formatRwf(total) })}
          style={[styles.payButton, { backgroundColor: colors.marigold }, processing && styles.payButtonDisabled]}
        >
          {processing ? (
            <ActivityIndicator color={colors.pine} />
          ) : (
            <Text style={[styles.payLabel, { color: colors.pine }]}>
              {t('checkout_pay', { amount: formatRwf(total) })}
            </Text>
          )}
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  totalLabel: { ...text.caption },
  tilesGap: { marginTop: space.md },
  itemsGap: { marginTop: space.xs },
  errorText: { ...text.caption, textAlign: 'center', marginTop: space.md },
  payButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: { opacity: 0.6 },
  payLabel: { ...text.bodySemi },
});

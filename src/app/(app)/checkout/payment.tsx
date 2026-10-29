import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const paymentMethodDbId = useCheckoutStore((state) => state.paymentMethodDbId);
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
    imageUrl: l.imageUrl,
  }));

  const appliedPromo = useCheckoutStore((state) => state.appliedPromo);
  const promoLoading = useCheckoutStore((state) => state.promoLoading);
  const promoError = useCheckoutStore((state) => state.promoError);
  const applyPromo = useCheckoutStore((state) => state.applyPromo);
  const removePromo = useCheckoutStore((state) => state.removePromo);
  const selectedLoanSessionRrn = useCheckoutStore((state) => state.selectedLoanSessionRrn);
  const [promoInput, setPromoInput] = useState('');
  const discount = appliedPromo?.discountAmount ?? 0;
  const finalTotal = total - discount;

  const onApplyPromo = async () => {
    if (!cartId || !promoInput.trim()) return;
    try {
      await applyPromo(cartId, promoInput.trim().toUpperCase());
      setPromoInput('');
    } catch {
      // error shown via promoError state
    }
  };

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
        paymentMethodId: paymentMethodDbId ?? method,
        deliveryAddress: address,
        phoneNumber: phone || undefined,
        promoCode: appliedPromo?.code,
        loanSessionRrn: selectedLoanSessionRrn ?? undefined,
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
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.onPine }]}>{t('checkout_orderTotal')}</Text>
            <PriceText amount={total} size="md" colorOverride={colors.paper} />
          </View>
          {discount > 0 && (
            <>
              <View style={[styles.totalRow, styles.discountRow]}>
                <Text style={[styles.totalLabel, { color: colors.marigold }]}>
                  {t('checkout_promoDiscount')} ({appliedPromo?.code})
                </Text>
                <Text style={[styles.discountAmount, { color: colors.marigold }]}>-{formatRwf(discount)}</Text>
              </View>
              <View style={[styles.totalRow, styles.finalRow]}>
                <Text style={[styles.finalLabel, { color: colors.onPine }]}>{t('checkout_finalTotal')}</Text>
                <PriceText amount={finalTotal} size="md" colorOverride={colors.marigold} />
              </View>
            </>
          )}
        </View>

        {/* Promo code input */}
        <View style={[styles.promoCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          {appliedPromo ? (
            <View style={styles.promoApplied}>
              <Text style={[styles.promoAppliedText, { color: colors.leaf }]}>
                {t('checkout_promoApplied')}: {appliedPromo.code} (-{formatRwf(appliedPromo.discountAmount)})
              </Text>
              <Pressable onPress={removePromo} accessibilityRole="button" accessibilityLabel={t('checkout_removePromo')}>
                <Text style={[styles.promoRemove, { color: colors.chili }]}>{t('checkout_remove')}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.promoRow}>
              <TextInput
                value={promoInput}
                onChangeText={setPromoInput}
                placeholder={t('checkout_promoPlaceholder')}
                placeholderTextColor={colors.secondary}
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={onApplyPromo}
                style={[styles.promoInput, { color: colors.ink, borderColor: colors.hairline }]}
              />
              <Pressable
                onPress={onApplyPromo}
                disabled={promoLoading || !promoInput.trim()}
                accessibilityRole="button"
                accessibilityLabel={t('checkout_applyPromo')}
                style={[styles.promoBtn, { backgroundColor: colors.pine }, (!promoInput.trim() || promoLoading) && styles.promoBtnDisabled]}
              >
                {promoLoading ? (
                  <ActivityIndicator size="small" color={colors.onPine} />
                ) : (
                  <Text style={[styles.promoBtnLabel, { color: colors.onPine }]}>{t('checkout_applyPromo')}</Text>
                )}
              </Pressable>
            </View>
          )}
          {promoError ? <Text style={[styles.promoError, { color: colors.chili }]}>{promoError}</Text> : null}
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
          accessibilityLabel={processing ? t('checkout_processingPayment') : t('checkout_pay', { amount: formatRwf(finalTotal) })}
          style={[styles.payButton, { backgroundColor: colors.marigold }, processing && styles.payButtonDisabled]}
        >
          {processing ? (
            <ActivityIndicator color={colors.pine} />
          ) : (
            <Text style={[styles.payLabel, { color: colors.pine }]}>
              {t('checkout_pay', { amount: formatRwf(finalTotal) })}
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
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  discountRow: { marginTop: space.xs },
  finalRow: { marginTop: space.xs, paddingTop: space.xs, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  totalLabel: { ...text.caption },
  finalLabel: { ...text.bodySemi },
  discountAmount: { ...text.bodySemi },
  promoCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.sm,
    marginTop: space.md,
  },
  promoRow: { flexDirection: 'row', gap: space.sm, alignItems: 'center' },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    ...text.body,
  },
  promoBtn: {
    paddingHorizontal: space.md,
    paddingVertical: space.xs + 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  promoBtnDisabled: { opacity: 0.5 },
  promoBtnLabel: { ...text.caption },
  promoApplied: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  promoAppliedText: { ...text.caption, flex: 1 },
  promoRemove: { ...text.caption, marginLeft: space.sm },
  promoError: { ...text.caption, marginTop: space.xs },
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

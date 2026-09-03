import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { PaymentMethodPicker } from './_components/PaymentMethodPicker';
import { OrderItemsCard } from '@/components/order';
import { CheckoutStepHeader } from '@/components/checkout';
import { PriceText } from '@/components/product';
import { useCheckoutStore, useWalletStore } from '@/stores';
import { scheduleLocalNotification } from '@/services/notificationService';
import { useT, translate } from '@/i18n';
import { orders } from '@/mocks';
import { formatRwf, sleep } from '@/lib';

const PROCESSING_DELAY_MS = 1300;
const LOW_BALANCE_THRESHOLD_RWF = 20_000;

/** Checkout payment step: choose a method and confirm, routing to the voucher or OTP flow as needed. */
export default function CheckoutPayment() {
  const t = useT();
  const { colors } = useTheme();
  const method = useCheckoutStore((state) => state.method);
  const walletBalance = useWalletStore((state) => state.balance);
  const activeOrder = orders.find((order) => order.id === 'FB-24815') ?? orders[0];
  const [processing, setProcessing] = useState(false);

  const onPayNow = async () => {
    if (method === 'VOUCHER') {
      router.push('/(app)/checkout/voucher');
      return;
    }
    if (method === 'CASH' && walletBalance - activeOrder.total < LOW_BALANCE_THRESHOLD_RWF) {
      await scheduleLocalNotification({
        channel: 'wallet',
        title: translate('notif_lowWalletBalance'),
        body: translate('notif_lowWalletBalanceBody'),
        deepLink: '/(app)/(tabs)/wallet',
        actionLabel: translate('wallet_topUp'),
      });
    }
    setProcessing(true);
    await sleep(PROCESSING_DELAY_MS);
    setProcessing(false);
    router.replace('/(app)/checkout/confirmation');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <CheckoutStepHeader title={t('checkout_payment')} step={2} />
      <ScreenScroll contentInsetBottom={80} applyTopInset={false}>
        <View style={[styles.totalCard, { backgroundColor: colors.pine }]}>
          <Text style={[styles.totalLabel, { color: colors.onPine }]}>{t('checkout_orderTotal')}</Text>
          <PriceText amount={activeOrder.total} size="md" colorOverride={colors.paper} />
        </View>
        <View style={styles.tilesGap}>
          <PaymentMethodPicker />
        </View>
        <View style={styles.itemsGap}>
          <OrderItemsCard lines={activeOrder.lines} />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onPayNow}
          disabled={processing}
          accessibilityRole="button"
          accessibilityLabel={
            processing ? t('checkout_processingPayment') : t('checkout_pay', { amount: formatRwf(activeOrder.total) })
          }
          style={[styles.payButton, { backgroundColor: colors.marigold }, processing && styles.payButtonDisabled]}
        >
          <Text style={[styles.payLabel, { color: colors.pine }]}>
            {processing ? t('checkout_processingPayment') : t('checkout_pay', { amount: formatRwf(activeOrder.total) })}
          </Text>
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
  payButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: { opacity: 0.6 },
  payLabel: { ...text.bodySemi },
});

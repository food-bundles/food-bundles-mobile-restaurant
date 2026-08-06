import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { PaymentMethodPicker } from './_components/PaymentMethodPicker';
import { OrderItemsCard } from '@/components/order';
import { CheckoutStepHeader } from '@/components/checkout';
import { PriceText } from '@/components/product';
import { useCheckoutStore } from '@/stores';
import { useT } from '@/i18n';
import { orders } from '@/mocks';
import { formatRwf } from '@/lib';

export default function CheckoutPayment() {
  const t = useT();
  const method = useCheckoutStore((state) => state.method);
  const activeOrder = orders.find((order) => order.id === 'FB-24815') ?? orders[0];

  const onPayNow = () => {
    if (method === 'VOUCHER') {
      router.push('/(app)/checkout/voucher');
    } else {
      router.push('/(app)/checkout/otp');
    }
  };

  return (
    <View style={styles.container}>
      <CheckoutStepHeader title={t('checkout_payment')} step={2} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t('checkout_orderTotal')}</Text>
          <PriceText amount={activeOrder.total} size="md" colorOverride={color.paper} />
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
          accessibilityRole="button"
          accessibilityLabel={t('checkout_pay', { amount: formatRwf(activeOrder.total) })}
          style={styles.payButton}
        >
          <Text style={styles.payLabel}>{t('checkout_pay', { amount: formatRwf(activeOrder.total) })}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.pine,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  totalLabel: { ...text.caption, color: color.onPine },
  tilesGap: { marginTop: space.md },
  itemsGap: { marginTop: space.xs },
  payButton: {
    minHeight: 48,
    backgroundColor: color.marigold,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payLabel: { ...text.bodySemi, color: color.pine },
});

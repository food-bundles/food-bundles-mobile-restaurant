import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { CheckoutStepHeader } from '@/components/checkout';
import { PriceText } from '@/components/product';
import { useVouchersStore } from '@/stores';
import { useT } from '@/i18n';
import { orders } from '@/mocks';

export default function VoucherStep() {
  const t = useT();
  const creditLimit = useVouchersStore((state) => state.creditLimit);
  const creditUsed = useVouchersStore((state) => state.creditUsed);
  const activeOrder = orders.find((order) => order.id === 'FB-24815') ?? orders[0];
  const creditAvailable = creditLimit - creditUsed;
  const remainingAfter = creditAvailable - activeOrder.total;

  return (
    <View style={styles.container}>
      <CheckoutStepHeader title={t('checkout_payWithVoucher')} step={2} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('checkout_orderTotal')}</Text>
            <PriceText amount={activeOrder.total} size="md" />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t('checkout_creditAvailable')}</Text>
            <PriceText amount={creditAvailable} size="md" />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>{t('checkout_remainingAfter')}</Text>
            <PriceText amount={remainingAfter} size="md" colorOverride={color.leaf} />
          </View>
        </View>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{t('checkout_voucherNote')}</Text>
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push('/(app)/checkout/otp')}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_voucherContinueBtn')}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>{t('checkout_voucherContinueBtn')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.md,
    gap: space.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...text.body, color: color.secondary },
  divider: { height: 1, backgroundColor: color.hairline, marginVertical: space.xs },
  notice: {
    flexDirection: 'row',
    backgroundColor: color.tintMarigold,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  noticeText: { ...text.caption, color: color.tintedAmberText, flex: 1 },
  button: {
    minHeight: 48,
    backgroundColor: color.marigold,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { ...text.bodySemi, color: color.pine },
});

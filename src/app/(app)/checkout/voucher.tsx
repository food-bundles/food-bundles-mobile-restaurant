import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { CheckoutStepHeader } from '@/components/checkout';
import { PriceText } from '@/components/product';
import { useVouchersStore } from '@/stores';
import { useT } from '@/i18n';
import { orders } from '@/mocks';

export default function VoucherStep() {
  const t = useT();
  const { colors } = useTheme();
  const creditLimit = useVouchersStore((state) => state.creditLimit);
  const creditUsed = useVouchersStore((state) => state.creditUsed);
  const activeOrder = orders.find((order) => order.id === 'FB-24815') ?? orders[0];
  const creditAvailable = creditLimit - creditUsed;
  const remainingAfter = creditAvailable - activeOrder.total;

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <CheckoutStepHeader title={t('checkout_payWithVoucher')} step={2} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.secondary }]}>{t('checkout_orderTotal')}</Text>
            <PriceText amount={activeOrder.total} size="md" />
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.secondary }]}>{t('checkout_creditAvailable')}</Text>
            <PriceText amount={creditAvailable} size="md" />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.hairline }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.secondary }]}>{t('checkout_remainingAfter')}</Text>
            <PriceText amount={remainingAfter} size="md" colorOverride={colors.leaf} />
          </View>
        </View>
        <View style={[styles.notice, { backgroundColor: colors.tintMarigold }]}>
          <Text style={[styles.noticeText, { color: colors.tintedAmberText }]}>{t('checkout_voucherNote')}</Text>
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push('/(app)/checkout/otp')}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_voucherContinueBtn')}
          style={[styles.button, { backgroundColor: colors.marigold }]}
        >
          <Text style={[styles.buttonLabel, { color: colors.pine }]}>{t('checkout_voucherContinueBtn')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.md,
    gap: space.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...text.body },
  divider: { height: 1, marginVertical: space.xs },
  notice: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  noticeText: { ...text.caption, flex: 1 },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { ...text.bodySemi },
});

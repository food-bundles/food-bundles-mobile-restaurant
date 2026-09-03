import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { CheckoutStepHeader } from '@/components/checkout';
import { CheckIcon } from '@/components/icons';
import { PriceText } from '@/components/product';
import { useCheckoutStore, useVouchersStore } from '@/stores';
import { useT } from '@/i18n';
import { formatDate, formatRwf } from '@/lib';
import { orders } from '@/mocks';

export default function VoucherStep() {
  const t = useT();
  const { colors } = useTheme();
  const vouchers = useVouchersStore((state) => state.vouchers);
  const setSelectedVoucherId = useCheckoutStore((state) => state.setSelectedVoucherId);
  const activeOrder = orders.find((order) => order.id === 'FB-24815') ?? orders[0];
  const available = vouchers.filter((voucher) => voucher.status === 'AVAILABLE');
  const [selectedId, setSelectedId] = useState<string | null>(available[0]?.id ?? null);

  const selected = available.find((voucher) => voucher.id === selectedId) ?? null;
  const remainingAfter = selected ? selected.amount - activeOrder.total : 0;

  const onContinue = () => {
    if (!selectedId) return;
    setSelectedVoucherId(selectedId);
    router.push('/(app)/checkout/otp');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <CheckoutStepHeader title={t('checkout_payWithVoucher')} step={2} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.secondary }]}>{t('checkout_orderTotal')}</Text>
          <PriceText amount={activeOrder.total} size="md" />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('checkout_chooseVoucher')}</Text>
        {available.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            <Text style={[styles.emptyText, { color: colors.secondary }]}>{t('checkout_noVouchersAvailable')}</Text>
          </View>
        ) : (
          available.map((voucher) => {
            const isSelected = voucher.id === selectedId;
            return (
              <Pressable
                key={voucher.id}
                onPress={() => setSelectedId(voucher.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={t('checkout_voucherOption', { amount: formatRwf(voucher.amount) })}
                style={[
                  styles.option,
                  { backgroundColor: colors.paper, borderColor: isSelected ? colors.leaf : colors.hairline },
                ]}
              >
                <View>
                  <Text style={[styles.optionAmount, { color: colors.ink }]}>{formatRwf(voucher.amount)}</Text>
                  <Text style={[styles.optionExpiry, { color: colors.secondary }]}>
                    {t('vouchers_expiresOn', { date: formatDate(voucher.expiresAt) })}
                  </Text>
                </View>
                {isSelected ? <CheckIcon size={20} color={colors.leaf} /> : null}
              </Pressable>
            );
          })
        )}
        {selected ? (
          <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.secondary }]}>{t('checkout_remainingAfter')}</Text>
              <PriceText amount={remainingAfter} size="md" colorOverride={remainingAfter >= 0 ? colors.leaf : colors.chili} />
            </View>
          </View>
        ) : null}
        <View style={[styles.notice, { backgroundColor: colors.tintMarigold }]}>
          <Text style={[styles.noticeText, { color: colors.tintedAmberText }]}>{t('checkout_voucherNote')}</Text>
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onContinue}
          disabled={!selectedId}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_voucherContinueBtn')}
          style={[
            styles.button,
            { backgroundColor: colors.marigold },
            !selectedId && { backgroundColor: colors.disabledLine },
          ]}
        >
          <Text style={[styles.buttonLabel, { color: colors.pine }]}>{t('checkout_voucherContinueBtn')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.md },
  label: { ...text.body },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  emptyCard: { borderWidth: 1, borderRadius: radius.lg, padding: space.lg, alignItems: 'center' },
  emptyText: { ...text.body, textAlign: 'center' },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  optionAmount: { ...text.bodySemi },
  optionExpiry: { ...text.caption, marginTop: 2 },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.md,
  },
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

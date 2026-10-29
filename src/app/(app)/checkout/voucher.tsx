import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { CheckoutStepHeader } from '@/components/checkout';
import { CheckIcon } from '@/components/icons';
import { PriceText } from '@/components/product';
import { useCheckoutStore, useVouchersStore, useCartStore } from '@/stores';
import { useT } from '@/i18n';
import { formatDate, formatRwf } from '@/lib';
import { getDeliveryFeeApi } from '@/api/config.api';

const DEFAULT_DELIVERY_FEE = 3000;

type SelectionType = 'voucher' | 'loan';

export default function VoucherStep() {
  const t = useT();
  const { colors } = useTheme();
  const vouchers = useVouchersStore((state) => state.vouchers);
  const setSelectedVoucherId = useCheckoutStore((state) => state.setSelectedVoucherId);
  const setSelectedLoanSessionRrn = useCheckoutStore((state) => state.setSelectedLoanSessionRrn);
  const fetchLoanSessions = useCheckoutStore((state) => state.fetchLoanSessions);
  const loanSessions = useCheckoutStore((state) => state.loanSessions);
  const subtotal = useCartStore((state) => state.subtotal());
  const [deliveryFee, setDeliveryFee] = useState(DEFAULT_DELIVERY_FEE);
  const total = subtotal + deliveryFee;

  const [tab, setTab] = useState<SelectionType>('voucher');
  const available = vouchers.filter((v) => v.status === 'AVAILABLE');
  // Show sessions that still have remaining balance
  const activeLoanSessions = loanSessions.filter((s) => s.remainingAmount > 0);

  const [selectedVoucherId, setLocalVoucherId] = useState<string | null>(available[0]?.id ?? null);
  const [selectedRrn, setLocalRrn] = useState<string | null>(activeLoanSessions[0]?.rrn ?? null);

  useEffect(() => {
    fetchLoanSessions();
    getDeliveryFeeApi().then(setDeliveryFee).catch(() => {});
  }, [fetchLoanSessions]);

  const selectedVoucher = available.find((v) => v.id === selectedVoucherId) ?? null;
  const remainingAfter = selectedVoucher ? selectedVoucher.amount - total : 0;

  const canContinue = tab === 'voucher' ? !!selectedVoucherId : !!selectedRrn;

  const onContinue = () => {
    if (tab === 'voucher' && selectedVoucherId) {
      setSelectedVoucherId(selectedVoucherId);
      setSelectedLoanSessionRrn(null);
      router.push('/(app)/checkout/otp');
    } else if (tab === 'loan' && selectedRrn) {
      setSelectedLoanSessionRrn(selectedRrn);
      setSelectedVoucherId(null);
      router.push('/(app)/checkout/otp');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <CheckoutStepHeader title={t('checkout_payWithVoucher')} step={2} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.secondary }]}>{t('checkout_orderTotal')}</Text>
          <PriceText amount={total} size="md" />
        </View>

        {/* Tab selector */}
        <View style={[styles.tabs, { borderColor: colors.hairline }]}>
          <Pressable
            onPress={() => setTab('voucher')}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'voucher' }}
            style={[styles.tab, tab === 'voucher' && { backgroundColor: colors.pine }]}
          >
            <Text style={[styles.tabLabel, { color: tab === 'voucher' ? colors.onPine : colors.secondary }]}>
              {t('checkout_chooseVoucher')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('loan')}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'loan' }}
            style={[styles.tab, tab === 'loan' && { backgroundColor: colors.pine }]}
          >
            <Text style={[styles.tabLabel, { color: tab === 'loan' ? colors.onPine : colors.secondary }]}>
              {t('checkout_voucherCard')}
            </Text>
          </Pressable>
        </View>

        {/* Discount vouchers */}
        {tab === 'voucher' && (
          <>
            {available.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                <Text style={[styles.emptyText, { color: colors.secondary }]}>{t('checkout_noVouchersAvailable')}</Text>
              </View>
            ) : (
              available.map((voucher) => {
                const isSelected = voucher.id === selectedVoucherId;
                return (
                  <Pressable
                    key={voucher.id}
                    onPress={() => setLocalVoucherId(voucher.id)}
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
            {selectedVoucher ? (
              <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: colors.secondary }]}>{t('checkout_remainingAfter')}</Text>
                  <PriceText amount={remainingAfter} size="md" colorOverride={remainingAfter >= 0 ? colors.leaf : colors.chili} />
                </View>
              </View>
            ) : null}
          </>
        )}

        {/* Loan sessions (VoucherCard) */}
        {tab === 'loan' && (
          <>
            {activeLoanSessions.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                <Text style={[styles.emptyText, { color: colors.secondary }]}>{t('checkout_noActiveLoanSessions')}</Text>
              </View>
            ) : (
              activeLoanSessions.map((session) => {
                const isSelected = session.rrn === selectedRrn;
                return (
                  <Pressable
                    key={session.id}
                    onPress={() => setLocalRrn(session.rrn)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.option,
                      { backgroundColor: colors.paper, borderColor: isSelected ? colors.leaf : colors.hairline },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionAmount, { color: colors.ink }]}>
                        {formatRwf(session.remainingAmount)} {t('checkout_available')}
                      </Text>
                      <Text style={[styles.optionExpiry, { color: colors.secondary }]}>
                        {t('checkout_loanRrn')}: {session.rrn}
                      </Text>
                      <Text style={[styles.optionExpiry, { color: colors.secondary }]}>
                        {t('checkout_approved')}: {formatRwf(session.amount)}
                      </Text>
                    </View>
                    {isSelected ? <CheckIcon size={20} color={colors.leaf} /> : null}
                  </Pressable>
                );
              })
            )}
          </>
        )}

        <View style={[styles.notice, { backgroundColor: colors.tintMarigold }]}>
          <Text style={[styles.noticeText, { color: colors.tintedAmberText }]}>{t('checkout_voucherNote')}</Text>
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onContinue}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_voucherContinueBtn')}
          style={[styles.button, { backgroundColor: colors.marigold }, !canContinue && { backgroundColor: colors.disabledLine }]}
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
  tabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radius.md,
    marginTop: space.lg,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: space.sm,
    alignItems: 'center',
  },
  tabLabel: { ...text.caption },
  emptyCard: { borderWidth: 1, borderRadius: radius.lg, padding: space.lg, alignItems: 'center', marginTop: space.md },
  emptyText: { ...text.body, textAlign: 'center' },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.sm,
  },
  optionAmount: { ...text.bodySemi },
  optionExpiry: { ...text.caption, marginTop: 2 },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.lg, marginTop: space.md },
  notice: { flexDirection: 'row', borderRadius: radius.md, padding: space.md, marginTop: space.md },
  noticeText: { ...text.caption, flex: 1 },
  button: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { ...text.bodySemi },
});

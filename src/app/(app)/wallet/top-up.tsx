import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { MobileMoneyTile, CardTile } from '@/components/payment';
import { TopupAmountInput } from './_components/TopupAmountInput';
import { QuickAmountChips } from './_components/QuickAmountChips';
import { ShareAccountantRow } from './_components/ShareAccountantRow';
import { ActionSheet } from './_components/ActionSheet';
import { useWalletStore } from '@/stores';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib';
import { account } from '@/mocks';

export default function TopUp() {
  const t = useT();
  const { colors } = useTheme();
  const topUp = useWalletStore((state) => state.topUp);
  const [amount, setAmount] = useState(200000);
  const [method, setMethod] = useState<'MOBILE_MONEY' | 'CARD'>('MOBILE_MONEY');
  const [phone, setPhone] = useState(account.phone);
  const [submitting, setSubmitting] = useState(false);
  const [openSheet, setOpenSheet] = useState<'share' | 'accountant' | null>(null);

  const onConfirm = async () => {
    setSubmitting(true);
    await topUp(amount);
    setSubmitting(false);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('wallet_topUpWallet')} />
      <ScreenScroll contentInsetBottom={80} applyTopInset={false}>
        <View style={styles.amountGap}>
          <TopupAmountInput amount={amount} onChangeAmount={setAmount} />
        </View>
        <View style={styles.chipsGap}>
          <QuickAmountChips selected={amount} onSelect={setAmount} />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('wallet_payFrom')}</Text>
        <View style={styles.tilesGap}>
          <MobileMoneyTile
            selected={method === 'MOBILE_MONEY'}
            onPress={() => setMethod('MOBILE_MONEY')}
            phone={phone}
            onChangeNumber={() =>
              setPhone((current) => (current === account.phone ? account.altPhone : account.phone))
            }
          />
          <CardTile selected={method === 'CARD'} onPress={() => setMethod('CARD')} />
        </View>
        <View style={styles.shareGap}>
          <ShareAccountantRow onShare={() => setOpenSheet('share')} onAskAccountant={() => setOpenSheet('accountant')} />
        </View>
      </ScreenScroll>
      <ActionSheet
        visible={openSheet === 'share'}
        onClose={() => setOpenSheet(null)}
        title={t('wallet_shareSheetTitle')}
        message={t('wallet_shareSheetMessage')}
      />
      <ActionSheet
        visible={openSheet === 'accountant'}
        onClose={() => setOpenSheet(null)}
        title={t('wallet_accountantSheetTitle')}
        message={t('wallet_accountantSheetMessage')}
      />
      <StickyFooter>
        <Pressable
          onPress={onConfirm}
          disabled={amount === 0 || submitting}
          accessibilityRole="button"
          accessibilityLabel={t('wallet_topUpAmount', { amount: formatRwf(amount) })}
          style={[
            styles.button,
            { backgroundColor: colors.marigold },
            (amount === 0 || submitting) && styles.buttonDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.pine} />
          ) : (
            <Text style={[styles.buttonLabel, { color: colors.pine }]}>
              {t('wallet_topUpAmount', { amount: formatRwf(amount) })}
            </Text>
          )}
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  amountGap: { marginTop: space.xl },
  chipsGap: { marginTop: space.lg },
  sectionLabel: { ...text.overline, marginTop: space.xl, marginBottom: space.sm },
  tilesGap: { gap: space.sm },
  shareGap: { marginTop: space.md },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: { ...text.bodySemi },
});

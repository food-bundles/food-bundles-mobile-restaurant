import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
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
    <View style={styles.container}>
      <ScreenHeader title={t('wallet_topUpWallet')} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.amountGap}>
          <TopupAmountInput amount={amount} onChangeAmount={setAmount} />
        </View>
        <View style={styles.chipsGap}>
          <QuickAmountChips selected={amount} onSelect={setAmount} />
        </View>
        <Text style={styles.sectionLabel}>{t('wallet_payFrom')}</Text>
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
          style={[styles.button, (amount === 0 || submitting) && styles.buttonDisabled]}
        >
          {submitting ? (
            <ActivityIndicator color={color.pine} />
          ) : (
            <Text style={styles.buttonLabel}>{t('wallet_topUpAmount', { amount: formatRwf(amount) })}</Text>
          )}
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  amountGap: { marginTop: space.xl },
  chipsGap: { marginTop: space.lg },
  sectionLabel: { ...text.overline, color: color.secondary, marginTop: space.xl, marginBottom: space.sm },
  tilesGap: { gap: space.sm },
  shareGap: { marginTop: space.md },
  button: {
    minHeight: 48,
    backgroundColor: color.marigold,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: { ...text.bodySemi, color: color.pine },
});

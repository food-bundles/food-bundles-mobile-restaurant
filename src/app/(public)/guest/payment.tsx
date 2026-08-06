import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { MobileMoneyTile, CardTile } from '@/components/payment';
import { GuestTotalsCard } from '../_components/GuestTotalsCard';
import { CheckoutStepHeader } from '@/components/checkout';
import { useGuestCartStore } from '@/stores';
import { sleep, formatRwf } from '@/lib';
import { useT } from '@/i18n';
import { account } from '@/mocks';

type Method = 'MOBILE_MONEY' | 'CARD';

export default function GuestPayment() {
  const t = useT();
  const total = useGuestCartStore((state) => state.total());
  const [method, setMethod] = useState<Method>('MOBILE_MONEY');
  const [phone, setPhone] = useState(account.phone);
  const [processing, setProcessing] = useState(false);

  const onPay = async () => {
    setProcessing(true);
    await sleep(1300);
    setProcessing(false);
    router.replace('/(public)/guest/confirmation');
  };

  return (
    <View style={styles.container}>
      <CheckoutStepHeader title={t('guest_payment')} step={2} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.totalsGap}>
          <GuestTotalsCard />
        </View>
        <View style={styles.tiles}>
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
        <Text style={styles.note}>{t('guest_walletVoucherNote')}</Text>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onPay}
          disabled={processing}
          accessibilityRole="button"
          accessibilityLabel={t('guest_pay', { amount: formatRwf(total) })}
          style={[styles.button, processing && styles.buttonDisabled]}
        >
          {processing ? (
            <ActivityIndicator color={color.paper} />
          ) : (
            <Text style={styles.buttonLabel}>{t('guest_pay', { amount: formatRwf(total) })}</Text>
          )}
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  totalsGap: { marginTop: space.md },
  tiles: { gap: space.sm, marginTop: space.lg },
  note: { ...text.caption, color: color.muted, marginTop: space.md },
  button: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonLabel: { ...text.bodySemi, color: color.paper },
});

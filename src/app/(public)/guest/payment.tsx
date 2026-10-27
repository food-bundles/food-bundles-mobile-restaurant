import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { MobileMoneyTile, CardTile } from '@/components/payment';
import { GuestTotalsCard } from '../_components/GuestTotalsCard';
import { CheckoutStepHeader } from '@/components/checkout';
import { useGuestCartStore, useGuestDeliveryStore } from '@/stores';
import { placeGuestOrderApi } from '@/api/guestOrder.api';
import { ApiError } from '@/api/client';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';

type Method = 'MOBILE_MONEY' | 'CARD';

export default function GuestPayment() {
  const t = useT();
  const { colors } = useTheme();
  const lines = useGuestCartStore((state) => state.lines);
  const total = useGuestCartStore((state) => state.total());
  const delivery = useGuestDeliveryStore();
  const [method, setMethod] = useState<Method>('MOBILE_MONEY');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPay = async () => {
    setProcessing(true);
    setError(null);
    try {
      await placeGuestOrderApi({
        lines: lines.map((l) => ({ productId: l.productId, qty: l.qty, unitPrice: l.unitPrice })),
        contactName: delivery.name,
        contactPhone: delivery.phone,
        deliveryStreet: delivery.street,
        deliveryLandmark: delivery.landmark || undefined,
        paymentMethod: method,
      });
      router.replace('/(public)/guest/confirmation');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof TypeError) {
        setError('Cannot reach the server. Check your network connection.');
      } else {
        setError('Payment failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <CheckoutStepHeader title={t('guest_payment')} step={2} />
      <ScreenScroll contentInsetBottom={80} applyTopInset={false}>
        <View style={styles.totalsGap}>
          <GuestTotalsCard />
        </View>
        <View style={styles.tiles}>
          <MobileMoneyTile
            selected={method === 'MOBILE_MONEY'}
            onPress={() => setMethod('MOBILE_MONEY')}
            phone={phone}
            onChangeNumber={() => setPhone('')}
          />
          <CardTile selected={method === 'CARD'} onPress={() => setMethod('CARD')} />
        </View>
        <Text style={[styles.note, { color: colors.muted }]}>{t('guest_walletVoucherNote')}</Text>
        {error ? <Text style={[styles.error, { color: colors.chili }]}>{error}</Text> : null}
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onPay}
          disabled={processing}
          accessibilityRole="button"
          accessibilityLabel={t('guest_pay', { amount: formatRwf(total) })}
          style={[styles.button, { backgroundColor: colors.leaf }, processing && styles.buttonDisabled]}
        >
          {processing ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Text style={[styles.buttonLabel, { color: colors.paper }]}>
              {t('guest_pay', { amount: formatRwf(total) })}
            </Text>
          )}
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  totalsGap: { marginTop: space.md },
  tiles: { gap: space.sm, marginTop: space.lg },
  note: { ...text.caption, marginTop: space.md },
  error: { ...text.caption, textAlign: 'center', marginTop: space.sm },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonLabel: { ...text.bodySemi },
});

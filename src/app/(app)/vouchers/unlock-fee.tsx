import { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { formatRwf } from '@/lib';
import { payUnlockFeeApi } from '@/api/voucher-card.api';

type PaymentMethod = 'mobile_money' | 'card';

export default function UnlockFeeScreen() {
  const { colors } = useTheme();
  const { sessionId, unlockFee } = useLocalSearchParams<{ sessionId: string; unlockFee: string }>();
  const fee = Number(unlockFee ?? 0);

  const [method, setMethod] = useState<PaymentMethod>('mobile_money');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onPay() {
    if (!sessionId) return;
    if (method === 'mobile_money' && !phone) {
      setError('Please enter your MTN/Airtel phone number.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await payUnlockFeeApi(sessionId, {
        paymentMethod: method,
        phoneNumber: method === 'mobile_money' ? phone : undefined,
      });
      if (result.requiresRedirect && result.redirectUrl) {
        await Linking.openURL(result.redirectUrl);
      }
      setDone(true);
    } catch (e: any) {
      setError(e?.message ?? 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title="Unlock Fee" />
        <View style={styles.successWrap}>
          <Text style={[styles.successTitle, { color: colors.ink }]}>Payment Initiated</Text>
          <Text style={[styles.successSub, { color: colors.secondary }]}>
            {method === 'mobile_money'
              ? 'Check your phone for a payment prompt to complete the unlock fee.'
              : 'You have been redirected to complete the card payment. Return here once done.'}
          </Text>
          <Pressable
            onPress={() => router.replace('/(app)/vouchers/voucher-card')}
            style={[styles.btn, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.btnLabel, { color: colors.paper }]}>Back to Card</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Pay Unlock Fee" />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.intro, { color: colors.secondary }]}>
          Your loan has been approved. Pay the one-time unlock fee to activate access to your funds.
        </Text>

        <View style={[styles.feeCard, { backgroundColor: '#1a5c38' }]}>
          <Text style={styles.feeLabel}>UNLOCK FEE</Text>
          <Text style={styles.feeAmount}>{formatRwf(fee)}</Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>PAYMENT METHOD</Text>
        <View style={styles.methodRow}>
          {(['mobile_money', 'card'] as PaymentMethod[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMethod(m)}
              style={[
                styles.methodTile,
                { borderColor: method === m ? colors.leaf : colors.hairline },
                method === m && { backgroundColor: colors.tintLeaf },
              ]}
            >
              <Text style={[styles.methodLabel, { color: method === m ? colors.pine : colors.ink }]}>
                {m === 'mobile_money' ? 'Mobile Money' : 'Bank Card'}
              </Text>
            </Pressable>
          ))}
        </View>

        {method === 'mobile_money' ? (
          <>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>PHONE NUMBER</Text>
            <Input
              label="MTN / Airtel Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+250 7XX XXX XXX"
            />
          </>
        ) : (
          <Text style={[styles.redirectNote, { color: colors.secondary }]}>
            You will be redirected to a secure Flutterwave page to enter your card details.
          </Text>
        )}

        {error ? <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text> : null}

        <Pressable
          onPress={onPay}
          disabled={submitting}
          style={[styles.btn, { backgroundColor: '#f97316', marginTop: space.lg }, submitting && styles.disabled]}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.btnLabel, { color: '#fff' }]}>Pay {formatRwf(fee)}</Text>
          )}
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.caption, marginTop: space.sm, marginBottom: space.md },
  feeCard: {
    borderRadius: radius.lg,
    padding: space.lg,
    marginBottom: space.md,
    alignItems: 'center',
  },
  feeLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' },
  feeAmount: { color: '#fff', fontSize: 32, fontWeight: '700', marginTop: space.sm },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  methodRow: { flexDirection: 'row', gap: space.sm },
  methodTile: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: { ...text.bodySemi },
  redirectNote: { ...text.caption, marginTop: space.sm, lineHeight: 20 },
  btn: { minHeight: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  btnLabel: { ...text.bodySemi },
  disabled: { opacity: 0.5 },
  errorText: { ...text.caption, textAlign: 'center', marginTop: space.sm },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.md },
  successTitle: { ...text.h2, textAlign: 'center' },
  successSub: { ...text.body, textAlign: 'center', lineHeight: 22 },
});

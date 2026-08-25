import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon, VoucherIcon } from '@/components/icons';
import { OtpBoxes } from '@/components/checkout';
import { sleep } from '@/lib';
import { useT } from '@/i18n';
import { useCheckoutStore, useVouchersStore } from '@/stores';
import { orders } from '@/mocks';
import type { Href } from 'expo-router';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 24;
const MOCK_PREFILL = '418';

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

type Purpose = 'payment' | 'underwriting';

const DESTINATIONS: Record<Purpose, Href> = {
  payment: '/(app)/checkout/confirmation',
  underwriting: '/(app)/vouchers/score-result',
};

export default function Otp() {
  const t = useT();
  const { colors } = useTheme();
  const { purpose } = useLocalSearchParams<{ purpose?: Purpose }>();
  const redeemVoucher = useVouchersStore((state) => state.redeemVoucher);
  const selectedVoucherId = useCheckoutStore((state) => state.selectedVoucherId);
  const activeOrder = orders.find((order) => order.id === 'FB-24815') ?? orders[0];
  const [code, setCode] = useState(MOCK_PREFILL);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const onVerify = async () => {
    setVerifying(true);
    await sleep(1300);
    if ((purpose === undefined || purpose === 'payment') && selectedVoucherId) {
      redeemVoucher(selectedVoucherId, activeOrder.id);
    }
    setVerifying(false);
    router.replace(DESTINATIONS[purpose ?? 'payment']);
  };

  return (
    <ScreenScroll>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={t('action_back')}
        style={styles.backButton}
      >
        <ChevronLeftIcon />
      </Pressable>
      <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]}>
        <VoucherIcon size={26} color={colors.leaf} />
      </View>
      <Text style={[styles.title, { color: colors.ink }]}>{t('checkout_verifyTitle')}</Text>
      <Text style={[styles.subtitle, { color: colors.secondary }]}>
        {purpose === 'underwriting' ? t('checkout_otpSubGeneric') : t('checkout_otpSub')}
      </Text>
      <View style={styles.boxesWrap}>
        <TextInput
          value={code}
          onChangeText={(next) => setCode(next.replace(/\D/g, '').slice(0, CODE_LENGTH))}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          accessibilityLabel={t('a11y_enterOtp')}
          style={styles.hiddenInput}
        />
        <View style={styles.boxesVisual} pointerEvents="none">
          <OtpBoxes value={code} length={CODE_LENGTH} />
        </View>
      </View>
      {seconds > 0 ? (
        <Text style={[styles.resendText, { color: colors.secondary }]}>
          {t('checkout_resendIn', { time: formatCountdown(seconds) })}
        </Text>
      ) : (
        <Pressable
          onPress={() => setSeconds(RESEND_SECONDS)}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_resendNow')}
          style={styles.resendButton}
        >
          <Text style={[styles.resendLabel, { color: colors.leaf }]}>{t('checkout_resendNow')}</Text>
        </Pressable>
      )}
      <Pressable
        onPress={onVerify}
        disabled={verifying}
        accessibilityRole="button"
        accessibilityLabel={t('checkout_verifyPay')}
        style={[styles.verifyButton, { backgroundColor: colors.leaf }]}
      >
        <Text style={[styles.verifyLabel, { color: colors.paper }]}>{t('checkout_verifyPay')}</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  title: { ...text.h1, marginTop: space.md },
  subtitle: { ...text.body, marginTop: space.xs, marginBottom: space.lg },
  boxesWrap: { position: 'relative', height: 56 },
  boxesVisual: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hiddenInput: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 },
  resendText: { ...text.caption, textAlign: 'center', marginTop: space.md },
  resendButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center', marginTop: space.md },
  resendLabel: { ...text.label },
  verifyButton: {
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyLabel: { ...text.bodySemi },
});

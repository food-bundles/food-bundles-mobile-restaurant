import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon, VoucherIcon } from '@/components/icons';
import { OtpBoxes } from './_components/OtpBoxes';
import { sleep } from '@/lib';
import { useT } from '@/i18n';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function Otp() {
  const t = useT();
  const [code, setCode] = useState('');
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
    setVerifying(false);
    router.replace('/(app)/checkout/confirmation');
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
      <View style={styles.iconWrap}>
        <VoucherIcon size={26} color={color.leaf} />
      </View>
      <Text style={styles.title}>{t('checkout_verifyTitle')}</Text>
      <Text style={styles.subtitle}>{t('checkout_otpSub')}</Text>
      <View style={styles.boxesWrap}>
        <TextInput
          value={code}
          onChangeText={(next) => setCode(next.replace(/\D/g, '').slice(0, CODE_LENGTH))}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          accessibilityLabel="Enter one-time code"
          style={styles.hiddenInput}
        />
        <OtpBoxes value={code} length={CODE_LENGTH} />
      </View>
      {seconds > 0 ? (
        <Text style={styles.resendText}>{t('checkout_resendIn', { seconds })}</Text>
      ) : (
        <Pressable
          onPress={() => setSeconds(RESEND_SECONDS)}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_resendNow')}
          style={styles.resendButton}
        >
          <Text style={styles.resendLabel}>{t('checkout_resendNow')}</Text>
        </Pressable>
      )}
      <Pressable
        onPress={onVerify}
        disabled={code.length !== CODE_LENGTH || verifying}
        accessibilityRole="button"
        accessibilityLabel={t('checkout_verifyPay')}
        style={[styles.verifyButton, (code.length !== CODE_LENGTH || verifying) && styles.verifyDisabled]}
      >
        <Text style={styles.verifyLabel}>{t('checkout_verifyPay')}</Text>
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
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  title: { ...text.h1, color: color.ink, marginTop: space.md },
  subtitle: { ...text.body, color: color.secondary, marginTop: space.xs, marginBottom: space.lg },
  boxesWrap: { position: 'relative' },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  resendText: { ...text.caption, color: color.secondary, textAlign: 'center', marginTop: space.md },
  resendButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center', marginTop: space.md },
  resendLabel: { ...text.label, color: color.leaf },
  verifyButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  verifyDisabled: { opacity: 0.5 },
  verifyLabel: { ...text.bodySemi, color: color.paper },
});

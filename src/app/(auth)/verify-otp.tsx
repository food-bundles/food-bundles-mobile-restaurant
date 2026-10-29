import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
import { verifyOtpApi, resendOtpApi } from '@/api/auth.api';
import { ApiError } from '@/api/client';
import { useSessionStore } from '@/stores/sessionStore';
import TermsModal from '@/components/TermsModal';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyOtp() {
  const { colors } = useTheme();
  const { phone, email, password } = useLocalSearchParams<{ phone: string; email: string; password: string }>();
  const login = useSessionStore((s) => s.login);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(React.ElementRef<typeof TextInput> | null)[]>([]);

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  const otp = digits.join('');
  const otpComplete = otp.length === OTP_LENGTH && !digits.includes('');

  // Start resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // Try to read SMS code automatically on Android
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let cancelled = false;
    (async () => {
      try {
        const text = await Clipboard.getStringAsync();
        const match = text?.match(/\b(\d{6})\b/);
        if (match && !cancelled) fillOtp(match[1]);
      } catch {
        // clipboard not available — ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function fillOtp(code: string) {
    const clean = code.replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < clean.length; i++) next[i] = clean[i];
    setDigits(next);
    const lastFilled = Math.min(clean.length, OTP_LENGTH - 1);
    inputRefs.current[lastFilled]?.focus();
  }

  function handleDigitChange(index: number, value: string) {
    setError(null);
    // Handle paste of full code
    if (value.length > 1) {
      fillOtp(value);
      return;
    }
    const char = value.replace(/\D/g, '');
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, e: NativeSyntheticEvent<{ key: string }>) {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    if (!otpComplete || verifying) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await verifyOtpApi(phone, otp);
      setPendingToken(res.token);
      setShowTerms(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  }

  async function handleAcceptTerms() {
    setShowTerms(false);
    if (!pendingToken) return;
    try {
      await login({ email: email, password });
      router.replace('/(app)/(tabs)');
    } catch {
      router.replace('/(auth)/login');
    }
  }

  async function handleResend() {
    if (resending || cooldown > 0) return;
    setResending(true);
    setError(null);
    try {
      await resendOtpApi(phone);
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <ScreenScroll contentContainerStyle={styles.content}>
        <View>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={[styles.backButton, { backgroundColor: colors.paper }]}
          >
            <ChevronLeftIcon />
          </Pressable>

          <Text style={[styles.title, { color: colors.ink }]}>Verify your phone</Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            We sent a 6-digit code to{'\n'}{phone}
          </Text>

          <View style={styles.otpRow}>
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <TextInput
                key={i}
                ref={(r) => { inputRefs.current[i] = r as React.ElementRef<typeof TextInput> | null; }}
                style={[
                  styles.otpBox,
                  {
                    borderColor: focusedIndex === i ? colors.leaf : colors.hairline,
                    backgroundColor: colors.paper,
                    color: colors.ink,
                  },
                ]}
                value={digits[i]}
                onChangeText={(v) => handleDigitChange(i, v)}
                onKeyPress={(e) => handleKeyPress(i, e)}
                onFocus={() => setFocusedIndex(i)}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                selectTextOnFocus
                accessibilityLabel={`Digit ${i + 1}`}
              />
            ))}
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text>
          ) : null}

          <Pressable
            onPress={handleResend}
            disabled={resending || cooldown > 0}
            accessibilityRole="button"
            style={styles.resendRow}
          >
            {resending ? (
              <ActivityIndicator size="small" color={colors.leaf} />
            ) : (
              <Text style={[styles.resendText, { color: cooldown > 0 ? colors.muted : colors.leaf }]}>
                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={handleVerify}
          disabled={!otpComplete || verifying}
          accessibilityRole="button"
          accessibilityLabel="Verify"
          style={[
            styles.submitButton,
            { backgroundColor: colors.leaf },
            (!otpComplete || verifying) && styles.submitDisabled,
          ]}
        >
          {verifying ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Text style={[styles.submitLabel, { color: colors.paper }]}>Verify</Text>
          )}
        </Pressable>
      </ScreenScroll>

      <TermsModal
        visible={showTerms}
        onAccept={handleAcceptTerms}
        onClose={() => setShowTerms(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'space-between' },
  backButton: {
    width: hit.min,
    height: hit.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  title: { ...text.h1, marginTop: space.lg },
  subtitle: { ...text.caption, marginTop: space.xs, marginBottom: space.xl },
  otpRow: {
    flexDirection: 'row',
    gap: space.sm,
    justifyContent: 'center',
    marginBottom: space.md,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderWidth: 1.5,
    borderRadius: radius.md,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
  },
  errorText: { ...text.caption, textAlign: 'center', marginBottom: space.sm },
  resendRow: { alignItems: 'center', paddingVertical: space.sm },
  resendText: { ...text.bodySemi },
  submitButton: {
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: { opacity: 0.5 },
  submitLabel: { ...text.bodySemi },
});

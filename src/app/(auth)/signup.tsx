import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { Input } from '@/components/primitives';
import { ChevronLeftIcon } from '@/components/icons';
import { useSessionStore } from '@/stores/sessionStore';
import { registerApi } from '@/api/auth.api';
import { ApiError } from '@/api/client';
import { useT } from '@/i18n';
import { formatTin, isValidTin } from '@/lib';
import type { Role } from '@/types';

export default function Signup() {
  const t = useT();
  const { colors } = useTheme();
  const login = useSessionStore((s) => s.login);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<Extract<Role, 'RESTAURANT' | 'HOTEL'>>('RESTAURANT');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tin, setTin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tinTouched, setTinTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tinInvalid = tinTouched && !isValidTin(tin);
  const canSubmit = businessName.trim().length > 0 && email.trim().length > 0 && isValidTin(tin) && password.length >= 6;

  const onSubmit = async () => {
    if (!isValidTin(tin)) {
      setTinTouched(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await registerApi({
        name: businessName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        tin: tin.replace(/\s/g, ''),
        password,
        role: businessType,
      });
      await login({ email: email.trim(), password });
      router.replace('/(app)/(tabs)');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof TypeError) {
        setError('Cannot reach the server. Check your network connection.');
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.content}>
      <View>
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel={t('auth_backToLogin')}
          style={[styles.backButton, { backgroundColor: colors.paper }]}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={[styles.title, { color: colors.ink }]}>{t('auth_createAccountTitle')}</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>{t('auth_forRestaurants')}</Text>
        <View style={styles.fields}>
          <Input label={t('auth_businessName')} value={businessName} onChangeText={setBusinessName} />
          <View>
            <Text style={[styles.typeLabel, { color: colors.ink }]}>{t('auth_businessType')}</Text>
            <View style={styles.typeRow}>
              {(['RESTAURANT', 'HOTEL'] as const).map((type) => {
                const active = type === businessType;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setBusinessType(type)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={type === 'RESTAURANT' ? t('auth_restaurant') : t('auth_hotel')}
                    style={[
                      styles.typeOption,
                      { borderColor: colors.hairline },
                      active && { backgroundColor: colors.leaf, borderColor: colors.leaf },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeLabelText,
                        { color: colors.secondary },
                        active && { color: colors.paper },
                      ]}
                    >
                      {type === 'RESTAURANT' ? t('auth_restaurant') : t('auth_hotel')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <Input label={t('auth_email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label={t('auth_phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input
            label={t('auth_tin')}
            value={tin}
            onChangeText={(value) => setTin(formatTin(value))}
            keyboardType="number-pad"
            maxLength={12}
            helper={tinInvalid ? undefined : t('auth_tinHelper')}
            helperTone="amber"
            error={tinInvalid ? t('auth_tinError') : undefined}
          />
          <Input
            label={t('auth_password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightSlot={
              <Pressable
                onPress={() => setShowPassword((p) => !p)}
                accessibilityRole="button"
                accessibilityLabel={t('auth_show')}
                style={styles.showButton}
              >
                <Text style={[styles.showLabel, { color: colors.leaf }]}>{t('auth_show')}</Text>
              </Pressable>
            }
          />
        </View>
      </View>
      <View>
        <Pressable
          onPress={onSubmit}
          disabled={loading || !canSubmit}
          accessibilityRole="button"
          accessibilityLabel={t('auth_createAccountBtn')}
          style={[styles.submitButton, { backgroundColor: colors.leaf }, (!canSubmit || loading) && styles.submitDisabled]}
        >
          {loading ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Text style={[styles.submitLabel, { color: colors.paper }]}>{t('auth_createAccountBtn')}</Text>
          )}
        </Pressable>
        {error ? <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text> : null}
        <Text style={[styles.staffNote, { color: colors.muted }]}>{t('auth_staffNote')}</Text>
      </View>
    </ScreenScroll>
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
  subtitle: { ...text.caption, marginTop: space.xs, marginBottom: space.lg },
  fields: { gap: space.md },
  typeLabel: { ...text.label, marginBottom: space.xs },
  typeRow: { flexDirection: 'row', gap: space.sm },
  typeOption: {
    flex: 1,
    minHeight: hit.min,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabelText: { ...text.bodySemi },
  submitButton: {
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: { opacity: 0.5 },
  submitLabel: { ...text.bodySemi },
  showButton: {
    minHeight: hit.min,
    paddingHorizontal: space.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showLabel: { ...text.label },
  errorText: { ...text.caption, textAlign: 'center', marginTop: space.sm },
  staffNote: { ...text.caption, marginTop: space.md },
});

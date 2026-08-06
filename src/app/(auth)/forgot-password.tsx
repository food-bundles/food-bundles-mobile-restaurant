import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { Input } from '@/components/primitives';
import { ChevronLeftIcon, CheckIcon } from '@/components/icons';
import { useT } from '@/i18n';
import { account } from '@/mocks';

export default function ForgotPassword() {
  const t = useT();
  const [email, setEmail] = useState(account.email);
  const [sent, setSent] = useState(false);

  return (
    <ScreenScroll>
      <Pressable
        onPress={() => router.push('/(auth)/login')}
        accessibilityRole="button"
        accessibilityLabel={t('auth_backToLogin')}
        style={styles.backButton}
      >
        <ChevronLeftIcon />
      </Pressable>
      <Text style={styles.title}>{t('auth_resetPassword')}</Text>
      <Text style={styles.subtitle}>{t('auth_resetSub')}</Text>
      <Input label={t('auth_email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Pressable
        onPress={() => setSent(true)}
        accessibilityRole="button"
        accessibilityLabel={t('auth_sendReset')}
        style={styles.sendButton}
      >
        <Text style={styles.sendLabel}>{t('auth_sendReset')}</Text>
      </Pressable>
      {sent ? (
        <View style={styles.hint}>
          <CheckIcon size={18} color={color.tintedGreenText} />
          <Text style={styles.hintText}>{t('auth_resetHint')}</Text>
        </View>
      ) : null}
      <Pressable
        onPress={() => router.push('/(auth)/login')}
        accessibilityRole="button"
        accessibilityLabel={t('auth_backToLogin')}
        style={styles.backToLoginButton}
      >
        <Text style={styles.backToLoginLabel}>{t('auth_backToLogin')}</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h1, color: color.ink, marginTop: space.md },
  subtitle: { ...text.body, color: color.secondary, marginTop: space.xs, marginBottom: space.lg },
  sendButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  sendLabel: { ...text.bodySemi, color: color.paper },
  hint: {
    flexDirection: 'row',
    gap: space.sm,
    backgroundColor: color.tintRipe,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
    alignItems: 'flex-start',
  },
  hintText: { ...text.caption, color: color.tintedGreenText, flex: 1 },
  backToLoginButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center', marginTop: space.lg },
  backToLoginLabel: { ...text.label, color: color.leaf },
});

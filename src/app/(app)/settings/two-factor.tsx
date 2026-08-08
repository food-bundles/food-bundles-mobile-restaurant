import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
import { useT } from '@/i18n';

const SECRET_KEY = 'K5D2 · 9F3A · 7C1B';

export default function TwoFactorSetup() {
  const t = useT();
  const [copied, setCopied] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('settings_twoFactor')}</Text>
      </View>
      <ScreenScroll contentInsetBottom={80}>
        <Text style={styles.intro}>{t('settings_twoFactorIntro')}</Text>
        <View style={styles.qrWrap}>
          <View style={styles.qrPlaceholder} accessible accessibilityLabel={t('a11y_authenticatorQr')} />
        </View>
        <View style={styles.keyRow}>
          <Text style={styles.keyText}>{SECRET_KEY}</Text>
          <Pressable
            onPress={() => setCopied(true)}
            accessibilityRole="button"
            accessibilityLabel={t('settings_copy')}
            style={styles.copyButton}
          >
            <Text style={styles.copyLabel}>{copied ? '✓' : t('settings_copy')}</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>{t('settings_enterCode')}</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codePlaceholder}>— — — — — —</Text>
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('settings_enable2fa')}
          style={styles.enableButton}
        >
          <Text style={styles.enableLabel}>{t('settings_enable2fa')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink },
  intro: { ...text.body, color: color.secondary, marginTop: space.md },
  qrWrap: { alignItems: 'center', marginTop: space.lg },
  qrPlaceholder: {
    width: 130,
    height: 130,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.lg,
  },
  keyText: { ...text.bodySemi, color: color.ink, letterSpacing: 1 },
  copyButton: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  copyLabel: { ...text.label, color: color.leaf },
  label: { ...text.label, color: color.ink, marginTop: space.lg, marginBottom: space.sm },
  codeBox: {
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.hairline,
    borderRadius: radius.md,
    padding: space.md,
  },
  codePlaceholder: { ...text.h2, color: color.muted, letterSpacing: 4 },
  enableButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableLabel: { ...text.bodySemi, color: color.paper },
});

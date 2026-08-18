import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { CheckIcon } from '@/components/icons';
import { useT } from '@/i18n';

/** Brief success state shown right after a TOTP code is verified and 2FA is enabled. */
export function TwoFactorEnabledScreen() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <ScreenScroll>
      <View style={styles.wrap}>
        <View style={[styles.icon, { backgroundColor: colors.ripe }]}>
          <CheckIcon size={26} color={colors.paper} />
        </View>
        <Text style={[styles.title, { color: colors.ink }]}>{t('settings_twoFactorEnabledTitle')}</Text>
        <Text style={[styles.sub, { color: colors.secondary }]}>{t('settings_twoFactorEnabledSub')}</Text>
        <Pressable
          onPress={() => router.replace('/(app)/settings/account')}
          accessibilityRole="button"
          accessibilityLabel={t('settings_account')}
          style={[styles.button, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.buttonLabel, { color: colors.paper }]}>{t('settings_account')}</Text>
        </Pressable>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginTop: space.xxl, gap: space.sm },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...text.h1 },
  sub: { ...text.body, textAlign: 'center' },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  buttonLabel: { ...text.bodySemi },
});

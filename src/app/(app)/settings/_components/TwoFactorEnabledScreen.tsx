import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { CheckIcon } from '@/components/icons';
import { useT } from '@/i18n';

/** Brief success state shown right after a TOTP code is verified and 2FA is enabled. */
export function TwoFactorEnabledScreen() {
  const t = useT();

  return (
    <ScreenScroll>
      <View style={styles.wrap}>
        <View style={styles.icon}>
          <CheckIcon size={26} color={color.paper} />
        </View>
        <Text style={styles.title}>{t('settings_twoFactorEnabledTitle')}</Text>
        <Text style={styles.sub}>{t('settings_twoFactorEnabledSub')}</Text>
        <Pressable
          onPress={() => router.replace('/(app)/settings/account')}
          accessibilityRole="button"
          accessibilityLabel={t('settings_account')}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>{t('settings_account')}</Text>
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
    backgroundColor: color.ripe,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...text.h1, color: color.ink },
  sub: { ...text.body, color: color.secondary, textAlign: 'center' },
  button: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  buttonLabel: { ...text.bodySemi, color: color.paper },
});

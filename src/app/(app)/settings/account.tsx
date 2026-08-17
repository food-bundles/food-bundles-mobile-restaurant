import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { ProfileImagePicker } from '@/components/primitives';
import { SettingsRow } from './_components/SettingsRow';
import { useSessionStore } from '@/stores';
import { useLanguage } from '@/stores';
import { useT } from '@/i18n';
import { account } from '@/mocks';
import type { Language } from '@/i18n';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'fr', label: 'Français' },
];

export default function Account() {
  const t = useT();
  const logout = useSessionStore((state) => state.logout);
  const restaurantImageUri = useSessionStore((state) => state.restaurantImageUri);
  const setRestaurantImage = useSessionStore((state) => state.setRestaurantImage);
  const twoFactorEnabled = useSessionStore((state) => state.twoFactorEnabled);
  const [language, setLanguage] = useLanguage();

  const onLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const cycleLanguage = () => {
    const index = LANGUAGES.findIndex((entry) => entry.code === language);
    setLanguage(LANGUAGES[(index + 1) % LANGUAGES.length].code);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('settings_account')} />
      <ScreenScroll contentInsetBottom={40}>
        <View style={styles.hero}>
          <ProfileImagePicker
            size={120}
            imageUri={restaurantImageUri}
            initials="AU"
            accessibilityLabel={t('settings_changeProfilePhoto')}
            onPicked={setRestaurantImage}
          />
          <Text style={styles.heroName}>{account.businessName}</Text>
          <Text style={styles.heroRole}>{t('more_managerLabel', { business: account.businessName })}</Text>
          <View style={styles.restaurantChip}>
            <Text style={styles.restaurantChipLabel}>{t('settings_restaurantBadge')}</Text>
          </View>
        </View>
        <Text style={styles.sectionLabel}>{t('settings_account')}</Text>
        <View style={styles.group}>
          <SettingsRow label={t('settings_businessDetails')} onPress={() => router.push('/(app)/settings/business')} />
          <SettingsRow label={t('settings_deliveryAddresses')} onPress={() => router.push('/(app)/settings/addresses')} />
          <SettingsRow label={t('settings_ebmInvoices')} onPress={() => router.push('/(app)/settings/ebm')} />
          <SettingsRow label={t('settings_messagesSupport')} onPress={() => router.push('/(app)/support/chat')} />
          <SettingsRow
            label={t('settings_twoFactor')}
            trailing={
              <View style={[styles.onBadge, !twoFactorEnabled && styles.offBadge]}>
                <Text style={[styles.onBadgeLabel, !twoFactorEnabled && styles.offBadgeLabel]}>
                  {twoFactorEnabled ? t('settings_twoFactorOn') : t('settings_twoFactorOff')}
                </Text>
              </View>
            }
            onPress={() => router.push('/(app)/settings/two-factor')}
            isLast
          />
        </View>
        <View style={styles.group}>
          <SettingsRow
            label={t('settings_language')}
            trailing={<Text style={styles.langValue}>{LANGUAGES.find((l) => l.code === language)?.label}</Text>}
            onPress={cycleLanguage}
          />
          <SettingsRow label={t('settings_logOut')} onPress={onLogout} destructive isLast />
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  hero: { alignItems: 'center', marginTop: space.lg, gap: space.xs },
  heroName: { ...text.h1, color: color.ink, marginTop: space.md },
  heroRole: { ...text.caption, color: color.secondary },
  restaurantChip: {
    backgroundColor: color.tintLeaf,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    marginTop: space.xs,
  },
  restaurantChipLabel: { ...text.micro, color: color.leaf },
  sectionLabel: { ...text.overline, color: color.secondary, marginTop: space.xl, marginBottom: space.sm },
  group: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: space.md,
  },
  onBadge: { backgroundColor: color.tintRipe, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  onBadgeLabel: { ...text.micro, color: color.tintedGreenText },
  offBadge: { backgroundColor: color.neutral },
  offBadgeLabel: { color: color.secondary },
  langValue: { ...text.caption, color: color.secondary },
});

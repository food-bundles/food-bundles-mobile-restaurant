import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { ProfileImagePicker } from '@/components/primitives';
import { SettingsRow } from './_components/SettingsRow';
import { AppearanceRow } from './_components/AppearanceRow';
import { useSessionStore } from '@/stores';
import { useLanguage } from '@/stores';
import { useT } from '@/i18n';
import { account } from '@/mocks';
import { clearAllCache } from '@/lib';
import type { Language } from '@/i18n';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'fr', label: 'Français' },
];

export default function Account() {
  const t = useT();
  const { colors } = useTheme();
  const logout = useSessionStore((state) => state.logout);
  const restaurantImageUri = useSessionStore((state) => state.restaurantImageUri);
  const setRestaurantImage = useSessionStore((state) => state.setRestaurantImage);
  const twoFactorEnabled = useSessionStore((state) => state.twoFactorEnabled);
  const [language, setLanguage] = useLanguage();

  const onLogout = () => {
    logout();
    clearAllCache();
    router.replace('/(auth)/login');
  };

  const cycleLanguage = () => {
    const index = LANGUAGES.findIndex((entry) => entry.code === language);
    setLanguage(LANGUAGES[(index + 1) % LANGUAGES.length].code);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
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
          <Text style={[styles.heroName, { color: colors.ink }]}>{account.businessName}</Text>
          <Text style={[styles.heroRole, { color: colors.secondary }]}>
            {t('more_managerLabel', { business: account.businessName })}
          </Text>
          <View style={[styles.restaurantChip, { backgroundColor: colors.tintLeaf }]}>
            <Text style={[styles.restaurantChipLabel, { color: colors.leaf }]}>
              {t('settings_restaurantBadge')}
            </Text>
          </View>
        </View>
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('settings_account')}</Text>
        <View style={[styles.group, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <SettingsRow label={t('settings_businessDetails')} onPress={() => router.push('/(app)/settings/business')} />
          <SettingsRow label={t('settings_deliveryAddresses')} onPress={() => router.push('/(app)/settings/addresses')} />
          <SettingsRow label={t('settings_ebmInvoices')} onPress={() => router.push('/(app)/settings/ebm')} />
          <SettingsRow
            label={t('settings_notificationsTitle')}
            onPress={() => router.push('/(app)/settings/notifications')}
          />
          <SettingsRow label={t('settings_messagesSupport')} onPress={() => router.push('/(app)/support/chat')} />
          <SettingsRow
            label={t('settings_twoFactor')}
            trailing={
              <View style={[styles.onBadge, { backgroundColor: twoFactorEnabled ? colors.tintRipe : colors.neutral }]}>
                <Text
                  style={[
                    styles.onBadgeLabel,
                    { color: twoFactorEnabled ? colors.tintedGreenText : colors.secondary },
                  ]}
                >
                  {twoFactorEnabled ? t('settings_twoFactorOn') : t('settings_twoFactorOff')}
                </Text>
              </View>
            }
            onPress={() => router.push('/(app)/settings/two-factor')}
            isLast
          />
        </View>
        <View style={[styles.group, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <SettingsRow
            label={t('settings_language')}
            trailing={<Text style={[styles.langValue, { color: colors.secondary }]}>{LANGUAGES.find((l) => l.code === language)?.label}</Text>}
            onPress={cycleLanguage}
          />
          <AppearanceRow />
          <SettingsRow label={t('settings_logOut')} onPress={onLogout} destructive isLast />
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { alignItems: 'center', marginTop: space.lg, gap: space.xs },
  heroName: { ...text.h1, marginTop: space.md },
  heroRole: { ...text.caption },
  restaurantChip: {
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    marginTop: space.xs,
  },
  restaurantChipLabel: { ...text.micro },
  sectionLabel: { ...text.overline, marginTop: space.xl, marginBottom: space.sm },
  group: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: space.md,
  },
  onBadge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  onBadgeLabel: { ...text.micro },
  langValue: { ...text.caption },
});

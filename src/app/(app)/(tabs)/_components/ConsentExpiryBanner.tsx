import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import type { DataConsentSource } from '@/mocks/types';

const NAME_KEY: Record<DataConsentSource, TranslationKey> = {
  eucl: 'consent_euclName',
  rra: 'consent_rraName',
  vubaVuba: 'consent_vubaName',
  kayko: 'consent_kaykoName',
  foodbundles: 'consent_foodbundlesName',
  creditBureau: 'consent_bureauName',
};

export interface ConsentExpiryBannerProps {
  expiredSources: DataConsentSource[];
}

/** Shown on the Vouchers pane when one or more data-consent grants have passed their 30-day window. */
export function ConsentExpiryBanner({ expiredSources }: ConsentExpiryBannerProps) {
  const t = useT();
  const { colors } = useTheme();

  if (expiredSources.length === 0) return null;

  const onRenew = () => {
    router.push({ pathname: '/(app)/vouchers/consent', params: { sources: expiredSources.join(',') } });
  };

  const message =
    expiredSources.length === 1
      ? t('consent_expiredSingle', { source: t(NAME_KEY[expiredSources[0]]) })
      : t('consent_expiredMultiple', { count: expiredSources.length });

  return (
    <View style={[styles.banner, { backgroundColor: colors.tintMarigold }]}>
      <Text style={[styles.message, { color: colors.tintedAmberText }]}>{message}</Text>
      <Pressable
        onPress={onRenew}
        accessibilityRole="button"
        accessibilityLabel={t('consent_renew')}
        style={styles.renewHit}
      >
        <Text style={[styles.renewLabel, { color: colors.tintedAmberText }]}>{t('consent_renew')} →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.md,
  },
  message: { ...text.caption },
  renewHit: { minHeight: hit.min, justifyContent: 'center', marginTop: space.xs },
  renewLabel: { ...text.label },
});

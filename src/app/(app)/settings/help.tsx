import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { SearchField } from '@/app/(app)/shop/_components/SearchField';
import { SettingsRow } from './_components/SettingsRow';
import { useT } from '@/i18n';

export default function Help() {
  const t = useT();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('help_title')} />
      <ScreenScroll contentInsetBottom={40}>
        <SearchField value={query} onChangeText={setQuery} placeholder={t('help_search')} />
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('help_topics')}</Text>
        <View style={[styles.group, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <SettingsRow label={t('help_ordersDelivery')} onPress={() => router.push('/(app)/(tabs)')} />
          <SettingsRow label={t('help_walletPayments')} onPress={() => router.push('/(app)/(tabs)/wallet')} />
          <SettingsRow
            label={t('help_vouchersCredit')}
            onPress={() => router.push({ pathname: '/(app)/(tabs)/wallet', params: { tab: 'vouchers' } })}
            isLast
          />
        </View>
        <View style={[styles.contactCard, { backgroundColor: colors.pine }]}>
          <View style={styles.contactText}>
            <Text style={[styles.contactTitle, { color: colors.paper }]}>{t('help_stillNeedHelp')}</Text>
            <Text style={[styles.contactSub, { color: colors.onPine }]}>{t('help_chatWithTeam')}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/(app)/support/chat')}
            accessibilityRole="button"
            accessibilityLabel={t('help_contact')}
            style={[styles.contactButton, { backgroundColor: colors.marigold }]}
          >
            <Text style={[styles.contactButtonLabel, { color: colors.pine }]}>{t('help_contact')}</Text>
          </Pressable>
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  group: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.lg,
  },
  contactText: { flex: 1 },
  contactTitle: { ...text.bodySemi },
  contactSub: { ...text.caption, marginTop: 2 },
  contactButton: {
    minHeight: hit.min,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonLabel: { ...text.bodySemi },
});

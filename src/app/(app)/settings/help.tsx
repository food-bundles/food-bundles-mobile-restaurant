import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { SearchField } from '@/app/(app)/shop/_components/SearchField';
import { SettingsRow } from './_components/SettingsRow';
import { useT } from '@/i18n';

export default function Help() {
  const t = useT();
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('help_title')} />
      <ScreenScroll contentInsetBottom={40}>
        <SearchField value={query} onChangeText={setQuery} placeholder={t('help_search')} />
        <Text style={styles.sectionLabel}>{t('help_topics')}</Text>
        <View style={styles.group}>
          <SettingsRow label={t('help_ordersDelivery')} onPress={() => router.push('/(app)/(tabs)')} />
          <SettingsRow label={t('help_walletPayments')} onPress={() => router.push('/(app)/(tabs)/wallet')} />
          <SettingsRow
            label={t('help_vouchersCredit')}
            onPress={() => router.push({ pathname: '/(app)/(tabs)/wallet', params: { tab: 'vouchers' } })}
            isLast
          />
        </View>
        <View style={styles.contactCard}>
          <View style={styles.contactText}>
            <Text style={styles.contactTitle}>{t('help_stillNeedHelp')}</Text>
            <Text style={styles.contactSub}>{t('help_chatWithTeam')}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/(app)/support/chat')}
            accessibilityRole="button"
            accessibilityLabel={t('help_contact')}
            style={styles.contactButton}
          >
            <Text style={styles.contactButtonLabel}>{t('help_contact')}</Text>
          </Pressable>
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  sectionLabel: { ...text.overline, color: color.secondary, marginTop: space.lg, marginBottom: space.sm },
  group: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: color.pine,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.lg,
  },
  contactText: { flex: 1 },
  contactTitle: { ...text.bodySemi, color: color.paper },
  contactSub: { ...text.caption, color: color.onPine, marginTop: 2 },
  contactButton: {
    minHeight: hit.min,
    backgroundColor: color.marigold,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonLabel: { ...text.bodySemi, color: color.pine },
});

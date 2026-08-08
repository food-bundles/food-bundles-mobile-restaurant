import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
import { SearchField } from '@/app/(app)/shop/_components/SearchField';
import { SettingsRow } from './_components/SettingsRow';
import { useT } from '@/i18n';

export default function Help() {
  const t = useT();

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
        <Text style={styles.title}>{t('help_title')}</Text>
      </View>
      <ScreenScroll contentInsetBottom={40}>
        <SearchField value="" onChangeText={() => undefined} placeholder={t('help_search')} />
        <Text style={styles.sectionLabel}>{t('help_topics')}</Text>
        <View style={styles.group}>
          <SettingsRow label={t('help_ordersDelivery')} onPress={() => undefined} />
          <SettingsRow label={t('help_walletPayments')} onPress={() => undefined} />
          <SettingsRow label={t('help_vouchersCredit')} onPress={() => undefined} isLast />
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

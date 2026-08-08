import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon, PlusIcon } from '@/components/icons';
import { AffiliatorRow } from './_components/AffiliatorRow';
import { affiliators, account } from '@/mocks';
import { useT } from '@/i18n';

export default function AffiliatorsList() {
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
        <Text style={styles.title}>{t('aff_title')}</Text>
        <Pressable
          onPress={() => router.push('/(app)/affiliators/add')}
          accessibilityRole="button"
          accessibilityLabel={t('aff_addTitle')}
          style={styles.addButton}
        >
          <PlusIcon color={color.paper} />
        </Pressable>
      </View>
      <ScreenScroll contentInsetBottom={40}>
        <Text style={styles.subtitle}>{t('aff_subtitle', { business: account.businessName })}</Text>
        <View style={styles.listGap}>
          {affiliators.map((affiliator) => (
            <AffiliatorRow key={affiliator.id} affiliator={affiliator} />
          ))}
        </View>
        <Pressable
          onPress={() => router.push('/(app)/affiliators/session')}
          accessibilityRole="button"
          accessibilityLabel={t('aff_previewStaff')}
          style={styles.previewButton}
        >
          <Text style={styles.previewLabel}>{t('aff_previewStaff')}</Text>
        </Pressable>
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
  title: { ...text.h2, color: color.ink, flex: 1 },
  addButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: { ...text.caption, color: color.secondary, marginTop: space.sm },
  listGap: { marginTop: space.md },
  previewButton: {
    minHeight: 44,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  previewLabel: { ...text.bodySemi, color: color.leaf },
});

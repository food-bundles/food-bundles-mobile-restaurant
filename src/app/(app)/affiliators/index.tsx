import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { PlusIcon } from '@/components/icons';
import { AffiliatorRow } from './_components/AffiliatorRow';
import { affiliators, account } from '@/mocks';
import { useT } from '@/i18n';

export default function AffiliatorsList() {
  const t = useT();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('aff_title')}
        trailing={
          <Pressable
            onPress={() => router.push('/(app)/affiliators/add')}
            accessibilityRole="button"
            accessibilityLabel={t('aff_addTitle')}
            style={styles.addButton}
          >
            <PlusIcon color={color.paper} />
          </Pressable>
        }
      />
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

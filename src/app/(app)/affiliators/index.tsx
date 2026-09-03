import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { PlusIcon } from '@/components/icons';
import { AffiliatorRow } from './_components/AffiliatorRow';
import { affiliators, account } from '@/mocks';
import { useT } from '@/i18n';

export default function AffiliatorsList() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader
        title={t('aff_title')}
        trailing={
          <Pressable
            onPress={() => router.push('/(app)/affiliators/add')}
            accessibilityRole="button"
            accessibilityLabel={t('aff_addTitle')}
            style={[styles.addButton, { backgroundColor: colors.leaf }]}
          >
            <PlusIcon color={colors.paper} />
          </Pressable>
        }
      />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          {t('aff_subtitle', { business: account.businessName })}
        </Text>
        <View style={styles.listGap}>
          {affiliators.map((affiliator) => (
            <AffiliatorRow key={affiliator.id} affiliator={affiliator} />
          ))}
        </View>
        <Pressable
          onPress={() => router.push('/(app)/affiliators/session')}
          accessibilityRole="button"
          accessibilityLabel={t('aff_previewStaff')}
          style={[styles.previewButton, { backgroundColor: colors.paper, borderColor: colors.leaf }]}
        >
          <Text style={[styles.previewLabel, { color: colors.leaf }]}>{t('aff_previewStaff')}</Text>
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: { ...text.caption, marginTop: space.sm },
  listGap: { marginTop: space.md },
  previewButton: {
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  previewLabel: { ...text.bodySemi },
});

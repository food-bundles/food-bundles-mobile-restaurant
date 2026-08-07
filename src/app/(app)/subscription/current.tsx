import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
import { CurrentPlanCard } from './_components/CurrentPlanCard';
import { useSessionStore } from '@/stores';
import { useT } from '@/i18n';

export default function CurrentPlan() {
  const t = useT();
  const tier = useSessionStore((state) => state.tier);

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
        <Text style={styles.title}>{t('sub_yourPlan')}</Text>
      </View>
      <ScreenScroll contentInsetBottom={40}>
        <View style={styles.cardGap}>
          <CurrentPlanCard tier={tier} />
        </View>
        <View style={styles.unlockCard}>
          <Text style={styles.unlockTitle}>{t('sub_unlockTitle')}</Text>
          <Text style={styles.unlockSub}>{t('sub_unlockSub')}</Text>
          <Pressable
            onPress={() => router.push('/(app)/subscription/plans')}
            accessibilityRole="button"
            accessibilityLabel={t('sub_seePlans')}
            style={styles.seePlansButton}
          >
            <Text style={styles.seePlansLabel}>{t('sub_seePlans')}</Text>
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
  cardGap: { marginTop: space.md },
  unlockCard: { backgroundColor: color.pine, borderRadius: radius.lg, padding: space.lg, marginTop: space.md },
  unlockTitle: { ...text.bodySemi, color: color.paper },
  unlockSub: { ...text.caption, color: color.onPine, marginTop: space.xs, marginBottom: space.md },
  seePlansButton: {
    minHeight: 44,
    backgroundColor: color.marigold,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seePlansLabel: { ...text.bodySemi, color: color.pine },
});

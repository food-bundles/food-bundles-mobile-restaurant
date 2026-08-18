import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { CurrentPlanCard } from './_components/CurrentPlanCard';
import { useSessionStore } from '@/stores';
import { useT } from '@/i18n';

export default function CurrentPlan() {
  const t = useT();
  const { colors } = useTheme();
  const tier = useSessionStore((state) => state.tier);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('sub_yourPlan')} />
      <ScreenScroll contentInsetBottom={40}>
        <View style={styles.cardGap}>
          <CurrentPlanCard tier={tier} />
        </View>
        <View style={[styles.unlockCard, { backgroundColor: colors.pine }]}>
          <Text style={[styles.unlockTitle, { color: colors.paper }]}>{t('sub_unlockTitle')}</Text>
          <Text style={[styles.unlockSub, { color: colors.onPine }]}>{t('sub_unlockSub')}</Text>
          <Pressable
            onPress={() => router.push('/(app)/subscription/plans')}
            accessibilityRole="button"
            accessibilityLabel={t('sub_seePlans')}
            style={[styles.seePlansButton, { backgroundColor: colors.marigold }]}
          >
            <Text style={[styles.seePlansLabel, { color: colors.pine }]}>{t('sub_seePlans')}</Text>
          </Pressable>
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardGap: { marginTop: space.md },
  unlockCard: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md },
  unlockTitle: { ...text.bodySemi },
  unlockSub: { ...text.caption, marginTop: space.xs, marginBottom: space.md },
  seePlansButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seePlansLabel: { ...text.bodySemi },
});

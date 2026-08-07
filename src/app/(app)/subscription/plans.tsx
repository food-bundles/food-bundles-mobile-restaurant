import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
import { BillingToggle } from './_components/BillingToggle';
import { PlanSelectCard } from './_components/PlanSelectCard';
import { plans } from '@/mocks';
import { useSessionStore } from '@/stores';
import { useT } from '@/i18n';
import type { BillingCycle, Tier } from '@/mocks/types';

export default function Plans() {
  const t = useT();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const termsAccepted = useSessionStore((state) => state.termsAccepted);
  const setTier = useSessionStore((state) => state.setTier);

  const onChoose = (tier: Exclude<Tier, 'NONE'>) => {
    if (!termsAccepted) {
      router.push({ pathname: '/(app)/subscription/terms', params: { tier } });
      return;
    }
    setTier(tier);
    router.push('/(app)/subscription/underwriting');
  };

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
        <Text style={styles.title}>{t('sub_plans')}</Text>
      </View>
      <ScreenScroll contentInsetBottom={40}>
        <View style={styles.toggleGap}>
          <BillingToggle selected={billingCycle} onSelect={setBillingCycle} />
        </View>
        <View style={styles.cardsGap}>
          {plans.map((plan) => (
            <PlanSelectCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              onChoose={() => onChoose(plan.id)}
            />
          ))}
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
  toggleGap: { marginTop: space.md },
  cardsGap: { gap: space.md, marginTop: space.md },
});

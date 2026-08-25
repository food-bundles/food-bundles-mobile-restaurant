import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { space, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { BillingToggle } from './_components/BillingToggle';
import { PlanSelectCard } from './_components/PlanSelectCard';
import { plans } from '@/mocks';
import { useSessionStore } from '@/stores';
import { useT } from '@/i18n';
import type { BillingCycle, Tier } from '@/mocks/types';

export default function Plans() {
  const t = useT();
  const { colors } = useTheme();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const termsAccepted = useSessionStore((state) => state.termsAccepted);
  const setTier = useSessionStore((state) => state.setTier);

  const onChoose = (tier: Exclude<Tier, 'NONE'>) => {
    if (!termsAccepted) {
      router.push({ pathname: '/(app)/subscription/terms', params: { tier } });
      return;
    }
    setTier(tier);
    router.push('/(app)/vouchers/consent');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('sub_plans')} />
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
  container: { flex: 1 },
  toggleGap: { marginTop: space.md },
  cardsGap: { gap: space.md, marginTop: space.md },
});

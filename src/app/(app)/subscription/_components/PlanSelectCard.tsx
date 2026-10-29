import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { PriceText } from '@/components/product';
import { useT } from '@/i18n';
import type { Plan, BillingCycle } from '@/types';

export interface PlanSelectCardProps {
  plan: Plan;
  billingCycle: BillingCycle;
  onChoose: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

export function PlanSelectCard({ plan, billingCycle, onChoose, isActive, disabled }: PlanSelectCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const premium = plan.id === 'PREMIUM';
  const amount = billingCycle === 'MONTHLY' ? plan.monthly : plan.weekly;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.paper, borderColor: colors.hairline },
        premium && { borderWidth: 2, borderColor: colors.leaf },
        isActive && { borderColor: colors.leaf, backgroundColor: colors.tintRipe },
      ]}
    >
      {isActive ? (
        <View style={[styles.popularBadge, { backgroundColor: colors.leaf }]}>
          <Text style={[styles.popularLabel, { color: colors.paper }]}>{t('sub_currentPlanBadge')}</Text>
        </View>
      ) : premium ? (
        <View style={[styles.popularBadge, { backgroundColor: colors.marigold }]}>
          <Text style={[styles.popularLabel, { color: colors.pine }]}>{t('landing_mostPopular')}</Text>
        </View>
      ) : null}
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: colors.ink }]}>{plan.name}</Text>
        <PriceText amount={amount} size="lg" />
      </View>
      {plan.features.map((feature) => (
        <Text key={feature} style={[styles.feature, { color: colors.body }]}>
          {'✓ '}
          {feature}
        </Text>
      ))}
      <Pressable
        onPress={isActive ? undefined : onChoose}
        disabled={isActive || disabled}
        accessibilityRole="button"
        accessibilityLabel={isActive ? t('sub_currentPlanBadge') : t('sub_choosePlan', { plan: plan.name })}
        style={[
          styles.chooseButton,
          { backgroundColor: isActive ? colors.leaf + '60' : premium ? colors.marigold : colors.leaf },
          (isActive || disabled) && styles.btnDisabled,
        ]}
      >
        <Text style={[styles.chooseLabel, { color: isActive ? colors.leaf : premium ? colors.pine : colors.paper }]}>
          {isActive ? t('sub_currentPlanBadge') : t('sub_choosePlan', { plan: plan.name })}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: space.md,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
  },
  popularLabel: { ...text.micro },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  name: { ...text.h2 },
  feature: { ...text.body, marginTop: space.xs },
  chooseButton: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  chooseLabel: { ...text.bodySemi },
  btnDisabled: { opacity: 0.6 },
});

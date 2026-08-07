import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { PriceText } from '@/components/product';
import { useT } from '@/i18n';
import type { Plan, BillingCycle } from '@/mocks/types';

export interface PlanSelectCardProps {
  plan: Plan;
  billingCycle: BillingCycle;
  onChoose: () => void;
}

export function PlanSelectCard({ plan, billingCycle, onChoose }: PlanSelectCardProps) {
  const t = useT();
  const premium = plan.id === 'PREMIUM';
  const amount = billingCycle === 'MONTHLY' ? plan.monthly : plan.weekly;

  return (
    <View style={[styles.card, premium && styles.cardPremium]}>
      {premium ? (
        <View style={styles.popularBadge}>
          <Text style={styles.popularLabel}>{t('landing_mostPopular')}</Text>
        </View>
      ) : null}
      <View style={styles.headerRow}>
        <Text style={styles.name}>{plan.name}</Text>
        <PriceText amount={amount} size="lg" />
      </View>
      {plan.features.map((feature) => (
        <Text key={feature} style={styles.feature}>
          {'✓ '}
          {feature}
        </Text>
      ))}
      <Pressable
        onPress={onChoose}
        accessibilityRole="button"
        accessibilityLabel={t('sub_choosePlan', { plan: plan.name })}
        style={[styles.chooseButton, premium ? styles.choosePremium : styles.chooseBasic]}
      >
        <Text style={[styles.chooseLabel, premium ? styles.choosePremiumLabel : styles.chooseBasicLabel]}>
          {t('sub_choosePlan', { plan: plan.name })}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  cardPremium: { borderWidth: 2, borderColor: color.leaf },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: space.md,
    backgroundColor: color.marigold,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
  },
  popularLabel: { ...text.micro, color: color.pine },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  name: { ...text.h2, color: color.ink },
  feature: { ...text.body, color: color.body, marginTop: space.xs },
  chooseButton: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  chooseBasic: { backgroundColor: color.leaf },
  choosePremium: { backgroundColor: color.marigold },
  chooseLabel: { ...text.bodySemi },
  chooseBasicLabel: { color: color.paper },
  choosePremiumLabel: { color: color.pine },
});

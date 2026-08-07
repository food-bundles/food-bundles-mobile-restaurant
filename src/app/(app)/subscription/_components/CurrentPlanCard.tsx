import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { PriceText } from '@/components/product';
import { plans } from '@/mocks';
import { useT } from '@/i18n';
import type { Tier } from '@/mocks/types';

export interface CurrentPlanCardProps {
  tier: Tier;
}

export function CurrentPlanCard({ tier }: CurrentPlanCardProps) {
  const t = useT();
  const plan = plans.find((p) => p.id === tier);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{plan ? plan.name : t('sub_noPlan')}</Text>
        {plan ? (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{t('sub_currentPlanBadge')}</Text>
          </View>
        ) : null}
      </View>
      {plan ? (
        <View style={styles.priceRow}>
          <PriceText amount={plan.monthly} size="lg" />
          <Text style={styles.perMonth}>{t('sub_perMonth')}</Text>
        </View>
      ) : null}
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
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...text.h2, color: color.ink },
  badge: { backgroundColor: color.tintLeaf, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  badgeLabel: { ...text.micro, color: color.pine },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.xs, marginTop: space.sm },
  perMonth: { ...text.caption, color: color.secondary },
});

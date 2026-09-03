import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { PriceText } from '@/components/product';
import { plans } from '@/mocks';
import { useT } from '@/i18n';
import type { Tier } from '@/mocks/types';

export interface CurrentPlanCardProps {
  tier: Tier;
}

export function CurrentPlanCard({ tier }: CurrentPlanCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const plan = plans.find((p) => p.id === tier);

  return (
    <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={styles.topRow}>
        <Text style={[styles.name, { color: colors.ink }]}>{plan ? plan.name : t('sub_noPlan')}</Text>
        {plan ? (
          <View style={[styles.badge, { backgroundColor: colors.tintLeaf }]}>
            <Text style={[styles.badgeLabel, { color: colors.pine }]}>{t('sub_currentPlanBadge')}</Text>
          </View>
        ) : null}
      </View>
      {plan ? (
        <View style={styles.priceRow}>
          <PriceText amount={plan.monthly} size="lg" />
          <Text style={[styles.perMonth, { color: colors.secondary }]}>{t('sub_perMonth')}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...text.h2 },
  badge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  badgeLabel: { ...text.micro },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.xs, marginTop: space.sm },
  perMonth: { ...text.caption },
});

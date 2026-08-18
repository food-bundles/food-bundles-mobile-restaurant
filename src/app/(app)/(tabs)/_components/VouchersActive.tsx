import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { CreditLineCard } from './CreditLineCard';
import { useVouchersStore, useSessionStore } from '@/stores';
import { useT } from '@/i18n';
import { formatDate, formatRwf } from '@/lib';

export function VouchersActive() {
  const t = useT();
  const { colors } = useTheme();
  const creditLimit = useVouchersStore((state) => state.creditLimit);
  const creditUsed = useVouchersStore((state) => state.creditUsed);
  const dueDate = useVouchersStore((state) => state.dueDate);
  const tier = useSessionStore((state) => state.tier);
  const isRepaymentDue = creditUsed > 0;

  return (
    <View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('vouchers_title')}</Text>
        <View style={[styles.planBadge, { backgroundColor: colors.tintLeaf }]}>
          <Text style={[styles.planLabel, { color: colors.pine }]}>{tier}</Text>
        </View>
      </View>
      <View style={styles.cardGap}>
        <CreditLineCard limit={creditLimit} used={creditUsed} isRepaymentDue={isRepaymentDue} />
      </View>
      <Pressable
        onPress={() => router.push('/(app)/checkout/voucher')}
        accessibilityRole="button"
        accessibilityLabel={t('vouchers_useAtCheckout')}
        style={[styles.useButton, { backgroundColor: colors.leaf }]}
      >
        <Text style={[styles.useLabel, { color: colors.paper }]}>{t('vouchers_useAtCheckout')}</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/(app)/vouchers/credit-line')}
        accessibilityRole="button"
        accessibilityLabel={t('vouchers_applyMore')}
        style={[styles.applyButton, { backgroundColor: colors.paper, borderColor: colors.leaf }]}
      >
        <Text style={[styles.applyLabel, { color: colors.leaf }]}>{t('vouchers_applyMore')}</Text>
      </Pressable>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('vouchers_repayment')}</Text>
      <View style={[styles.repaymentCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
        <View>
          <Text style={[styles.repaymentTitle, { color: colors.ink }]}>{t('vouchers_nextSettlement')}</Text>
          <Text style={[styles.repaymentSub, { color: colors.secondary }]}>
            {t('vouchers_due', { amount: formatRwf(creditUsed) })}
          </Text>
        </View>
        <Text style={[styles.repaymentDate, { color: colors.ink }]}>{formatDate(dueDate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...text.h2 },
  planBadge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  planLabel: { ...text.micro },
  cardGap: { marginTop: space.md },
  useButton: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  useLabel: { ...text.bodySemi },
  applyButton: {
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  applyLabel: { ...text.bodySemi },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  repaymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
  },
  repaymentTitle: { ...text.bodySemi },
  repaymentSub: { ...text.caption, marginTop: 2 },
  repaymentDate: { ...text.bodySemi },
});

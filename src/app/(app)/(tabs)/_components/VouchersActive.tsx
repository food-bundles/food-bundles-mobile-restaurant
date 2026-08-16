import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { CreditLineCard } from './CreditLineCard';
import { useVouchersStore, useSessionStore } from '@/stores';
import { useT } from '@/i18n';
import { formatDate, formatRwf } from '@/lib';

export function VouchersActive() {
  const t = useT();
  const creditLimit = useVouchersStore((state) => state.creditLimit);
  const creditUsed = useVouchersStore((state) => state.creditUsed);
  const dueDate = useVouchersStore((state) => state.dueDate);
  const tier = useSessionStore((state) => state.tier);
  const isRepaymentDue = creditUsed > 0;

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{t('vouchers_title')}</Text>
        <View style={styles.planBadge}>
          <Text style={styles.planLabel}>{tier}</Text>
        </View>
      </View>
      <View style={styles.cardGap}>
        <CreditLineCard limit={creditLimit} used={creditUsed} isRepaymentDue={isRepaymentDue} />
      </View>
      <Pressable
        onPress={() => router.push('/(app)/checkout/voucher')}
        accessibilityRole="button"
        accessibilityLabel={t('vouchers_useAtCheckout')}
        style={styles.useButton}
      >
        <Text style={styles.useLabel}>{t('vouchers_useAtCheckout')}</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/(app)/vouchers/credit-line')}
        accessibilityRole="button"
        accessibilityLabel={t('vouchers_applyMore')}
        style={styles.applyButton}
      >
        <Text style={styles.applyLabel}>{t('vouchers_applyMore')}</Text>
      </Pressable>
      <Text style={styles.sectionLabel}>{t('vouchers_repayment')}</Text>
      <View style={styles.repaymentCard}>
        <View>
          <Text style={styles.repaymentTitle}>{t('vouchers_nextSettlement')}</Text>
          <Text style={styles.repaymentSub}>{t('vouchers_due', { amount: formatRwf(creditUsed) })}</Text>
        </View>
        <Text style={styles.repaymentDate}>{formatDate(dueDate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...text.h2, color: color.ink },
  planBadge: { backgroundColor: color.tintLeaf, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  planLabel: { ...text.micro, color: color.pine },
  cardGap: { marginTop: space.md },
  useButton: {
    minHeight: 44,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  useLabel: { ...text.bodySemi, color: color.paper },
  applyButton: {
    minHeight: 44,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  applyLabel: { ...text.bodySemi, color: color.leaf },
  sectionLabel: { ...text.overline, color: color.secondary, marginTop: space.lg, marginBottom: space.sm },
  repaymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
  },
  repaymentTitle: { ...text.bodySemi, color: color.ink },
  repaymentSub: { ...text.caption, color: color.secondary, marginTop: 2 },
  repaymentDate: { ...text.bodySemi, color: color.ink },
});

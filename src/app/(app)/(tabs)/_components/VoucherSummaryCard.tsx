import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatDate, formatRwf } from '@/lib';

export interface VoucherSummaryCardProps {
  availableCount: number;
  totalCount: number;
  availableValue: number;
  nextGrantDate: string;
}

export function VoucherSummaryCard({
  availableCount,
  totalCount,
  availableValue,
  nextGrantDate,
}: VoucherSummaryCardProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.pine }]}>
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: colors.onPine }]}>{t('vouchers_title')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: colors.onPineSoft }]}>
          <Text style={[styles.statusLabel, { color: colors.pine }]}>{t('vouchers_activeLabel')}</Text>
        </View>
      </View>
      <Text style={[styles.hero, { color: colors.paper }]}>
        {t('vouchers_countLeft', { count: availableCount, total: totalCount })}
      </Text>
      <View style={styles.usedRow}>
        <Text style={[styles.usedLabel, { color: colors.onPineSoft }]}>
          {t('vouchers_worthAndGrant', { value: formatRwf(availableValue), date: formatDate(nextGrantDate) })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm },
  label: { ...text.overline },
  statusBadge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  statusLabel: { ...text.micro },
  hero: { ...text.priceHero },
  usedRow: { marginTop: space.sm },
  usedLabel: { ...text.caption, fontVariant: ['tabular-nums'] },
});

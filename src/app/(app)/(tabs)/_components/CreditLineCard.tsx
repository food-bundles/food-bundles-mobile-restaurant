import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { PriceText } from '@/components/product';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib';

export interface CreditLineCardProps {
  limit: number;
  used: number;
  isRepaymentDue: boolean;
}

export function CreditLineCard({ limit, used, isRepaymentDue }: CreditLineCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const available = limit - used;

  return (
    <View style={[styles.card, { backgroundColor: colors.pine }]}>
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: colors.onPine }]}>{t('vouchers_title')}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isRepaymentDue ? colors.marigold : colors.onPineSoft },
          ]}
        >
          <Text style={[styles.statusLabel, { color: colors.pine }]}>
            {isRepaymentDue ? t('vouchers_repaymentDueLabel') : t('vouchers_activeLabel')}
          </Text>
        </View>
      </View>
      <PriceText amount={available} size="hero" colorOverride={colors.paper} />
      <View style={styles.usedRow}>
        <Text style={[styles.usedLabel, { color: colors.onPineSoft }]}>
          {t('vouchers_usedOfLimit', {
            used: formatRwf(used),
            limit: formatRwf(limit),
          })}
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
  usedRow: { marginTop: space.sm },
  usedLabel: { ...text.caption, fontVariant: ['tabular-nums'] },
});

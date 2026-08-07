import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { PriceText } from '@/components/product';
import { useT } from '@/i18n';

export interface CreditLineCardProps {
  limit: number;
  used: number;
  isRepaymentDue: boolean;
}

export function CreditLineCard({ limit, used, isRepaymentDue }: CreditLineCardProps) {
  const t = useT();
  const available = limit - used;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{t('vouchers_title')}</Text>
        <View style={[styles.statusBadge, isRepaymentDue && styles.statusBadgeDue]}>
          <Text style={styles.statusLabel}>
            {isRepaymentDue ? t('vouchers_repaymentDueLabel') : t('vouchers_activeLabel')}
          </Text>
        </View>
      </View>
      <PriceText amount={available} size="hero" colorOverride={color.paper} />
      <View style={styles.usedRow}>
        <Text style={styles.usedLabel}>
          {t('vouchers_usedOfLimit', {
            used: `${used.toLocaleString('en-US')} RWF`,
            limit: `${limit.toLocaleString('en-US')} RWF`,
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.pine, borderRadius: radius.lg, padding: space.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm },
  label: { ...text.overline, color: color.onPine },
  statusBadge: { backgroundColor: color.onPineSoft, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  statusBadgeDue: { backgroundColor: color.marigold },
  statusLabel: { ...text.micro, color: color.pine },
  usedRow: { marginTop: space.sm },
  usedLabel: { ...text.caption, color: color.onPineSoft, fontVariant: ['tabular-nums'] },
});

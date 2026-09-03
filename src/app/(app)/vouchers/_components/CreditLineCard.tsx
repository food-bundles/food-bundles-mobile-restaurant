import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { formatDate, formatRwf } from '@/lib';
import { useT } from '@/i18n';

export interface CreditLineCardProps {
  limitRwf: number;
  renewsAtIso: string;
  supplierName: string;
}

/** Single "Your credit line" card shown on score-result: available amount, validity window, and supplier. */
export function CreditLineCard({ limitRwf, renewsAtIso, supplierName }: CreditLineCardProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('score_creditLineTitle')}</Text>
      <Text style={[styles.available, { color: colors.leaf }]}>
        {t('score_availableToUse', { amount: formatRwf(limitRwf) })}
      </Text>
      <Text style={[styles.meta, { color: colors.secondary }]}>
        {t('score_validFor', { date: formatDate(renewsAtIso) })}
      </Text>
      <Text style={[styles.meta, { color: colors.secondary }]}>{t('score_supplier', { name: supplierName })}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, ...shadow.card },
  title: { ...text.h2 },
  available: { ...text.priceLg, marginTop: space.sm },
  meta: { ...text.caption, marginTop: space.xs },
});

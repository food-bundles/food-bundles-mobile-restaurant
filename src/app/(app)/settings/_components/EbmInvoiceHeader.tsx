import { StyleSheet, Text, View } from 'react-native';
import { formatTin } from '@/lib';
import { radius, space, text, useTheme } from '@/theme';
import { PartnerLogo } from '@/components/partners';
import { useT } from '@/i18n';

const SELLER_TIN = '100482991';

export function EbmInvoiceHeader() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.logo}>
        <PartnerLogo partner="rra" name="RRA" width={48} height={32} />
      </View>
      <Text style={[styles.company, { color: colors.ink }]}>FoodBundles Ltd</Text>
      <Text style={[styles.meta, { color: colors.secondary }]}>KG 5 Ave, Kigali, Rwanda</Text>
      <Text style={[styles.meta, { color: colors.secondary }]}>TIN: {formatTin(SELLER_TIN)}</Text>
      <View style={[styles.certifiedBadge, { backgroundColor: colors.tintLeaf }]}>
        <Text style={[styles.certifiedLabel, { color: colors.tintedGreenText }]}>
          ✓ {t('ebm_rraCertified')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 2 },
  logo: { width: 48, height: 32, alignItems: 'center', justifyContent: 'center', marginBottom: space.xs },
  company: { ...text.h2 },
  meta: { ...text.caption },
  certifiedBadge: {
    marginTop: space.xs,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
  },
  certifiedLabel: { ...text.micro, letterSpacing: 0.5 },
});

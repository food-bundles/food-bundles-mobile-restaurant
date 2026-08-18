import { Image, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

const LOGO_URI = 'https://res.cloudinary.com/dzxyelclu/image/upload/v1760111270/Food_bundle_logo_cfsnsw.png';

export function EbmInvoiceHeader() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={[styles.company, { color: colors.ink }]}>FoodBundles Ltd</Text>
        <Text style={[styles.meta, { color: colors.secondary }]}>KG 5 Ave, Kigali</Text>
        <Text style={[styles.meta, { color: colors.secondary }]}>TIN 100 482 991</Text>
      </View>
      <View style={styles.rightCol}>
        <Image
          source={{ uri: LOGO_URI }}
          accessibilityLabel="FoodBundles logo"
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={[styles.certifiedBadge, { backgroundColor: colors.tintLeaf }]}>
          <Text style={[styles.certifiedLabel, { color: colors.tintedGreenText }]}>{t('ebm_rraCertified')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textCol: { gap: 2 },
  company: { ...text.bodySemi, fontSize: 16 },
  meta: { ...text.caption },
  rightCol: { alignItems: 'flex-end', gap: space.xs },
  logo: { width: 40, height: 40, borderRadius: radius.sm },
  certifiedBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  certifiedLabel: { ...text.micro },
});

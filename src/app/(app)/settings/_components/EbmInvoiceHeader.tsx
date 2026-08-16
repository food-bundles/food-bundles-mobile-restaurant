import { Image, StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

const LOGO_URI = 'https://res.cloudinary.com/dzxyelclu/image/upload/v1760111270/Food_bundle_logo_cfsnsw.png';

export function EbmInvoiceHeader() {
  const t = useT();

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.company}>FoodBundles Ltd</Text>
        <Text style={styles.meta}>KG 5 Ave, Kigali</Text>
        <Text style={styles.meta}>TIN 100 482 991</Text>
      </View>
      <View style={styles.rightCol}>
        <Image
          source={{ uri: LOGO_URI }}
          accessibilityLabel="FoodBundles logo"
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={styles.certifiedBadge}>
          <Text style={styles.certifiedLabel}>{t('ebm_rraCertified')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textCol: { gap: 2 },
  company: { ...text.bodySemi, color: color.ink, fontSize: 16 },
  meta: { ...text.caption, color: color.secondary },
  rightCol: { alignItems: 'flex-end', gap: space.xs },
  logo: { width: 40, height: 40, borderRadius: radius.sm },
  certifiedBadge: {
    backgroundColor: color.tintLeaf,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  certifiedLabel: { ...text.micro, color: color.tintedGreenText },
});

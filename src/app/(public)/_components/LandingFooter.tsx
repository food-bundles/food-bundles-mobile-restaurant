import { StyleSheet, Text, View } from 'react-native';
import { color, space, text } from '@/theme';
import { useT } from '@/i18n';

export function LandingFooter() {
  const t = useT();

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>FoodBundles</Text>
      <Text style={styles.blurb}>{t('landing_footerBlurb')}</Text>
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>{t('footer_quickLinks')}</Text>
          <Text style={styles.columnItem}>{t('footer_forFarmers')}</Text>
          <Text style={styles.columnItem}>{t('footer_forRestaurants')}</Text>
          <Text style={styles.columnItem}>{t('footer_support')}</Text>
          <Text style={styles.columnItem}>{t('footer_helpCenter')}</Text>
          <Text style={styles.columnItem}>{t('footer_contactUs')}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>{t('footer_contact')}</Text>
          <Text style={styles.columnItem}>sales@food.rw</Text>
          <Text style={styles.columnItem}>+250 796 897 823</Text>
          <Text style={styles.columnItem}>Call centre 6054</Text>
          <Text style={styles.columnItem}>KG 5 Ave, Kigali</Text>
        </View>
      </View>
      <Text style={styles.copyright}>{t('landing_copyright')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: color.ink, padding: space.lg, marginTop: space.xl },
  brand: { ...text.h2, color: color.paper },
  blurb: { ...text.caption, color: color.onPine, marginTop: space.sm },
  columns: { flexDirection: 'row', gap: space.xl, marginTop: space.lg },
  column: { flex: 1 },
  columnTitle: { ...text.overline, color: color.marigold },
  columnItem: { ...text.caption, color: color.onPine, marginTop: space.sm },
  copyright: {
    ...text.caption,
    color: color.muted,
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: color.body,
  },
});

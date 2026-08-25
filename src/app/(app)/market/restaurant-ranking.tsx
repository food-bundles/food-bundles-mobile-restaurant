import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { PurchasingPowerCard } from './_components/PurchasingPowerCard';
import { LocationRankCard } from './_components/LocationRankCard';
import { CostEfficiencyCard } from './_components/CostEfficiencyCard';
import { MenuPricingTable } from './_components/MenuPricingTable';
import { useT } from '@/i18n';

/** Anonymous peer benchmarking across purchasing power, location access and ingredient cost efficiency. */
export default function RestaurantRanking() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('ranking_title')} />
      <ScreenScroll contentInsetBottom={space.xl}>
        <Text style={[styles.disclaimer, { color: colors.secondary }]}>{t('ranking_anonymousDisclaimer')}</Text>
        <PurchasingPowerCard />
        <LocationRankCard />
        <CostEfficiencyCard />
        <MenuPricingTable />
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  disclaimer: { ...text.caption, fontStyle: 'italic', marginTop: space.sm },
});

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { CommodityTicker } from './CommodityTicker';
import { WatchlistCard } from './WatchlistCard';
import { MostActiveCard } from './MostActiveCard';
import { ChartErrorBoundary } from '@/components/market';
import { WATCHLIST, MOST_ACTIVE } from '@/mocks';
import { useT } from '@/i18n';

/** Portfolio-style landing view: live ticker, tracked-commodity watchlist, and today's most active movers. */
export function DashboardTab() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View>
      <CommodityTicker />
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('dashboard_watchlist')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {WATCHLIST.map((commodityId) => (
          <ChartErrorBoundary key={commodityId}>
            <WatchlistCard commodityId={commodityId} />
          </ChartErrorBoundary>
        ))}
      </ScrollView>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('dashboard_mostActive')}</Text>
      {MOST_ACTIVE.map((commodityId) => (
        <ChartErrorBoundary key={commodityId}>
          <MostActiveCard commodityId={commodityId} />
        </ChartErrorBoundary>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
});

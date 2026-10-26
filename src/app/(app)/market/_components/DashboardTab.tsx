import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { CommodityTicker } from './CommodityTicker';
import { WatchlistCard } from './WatchlistCard';
import { MostActiveCard } from './MostActiveCard';
import { ChartErrorBoundary } from '@/components/market';
import { useMarketStore } from '@/stores';
import { useEffect } from 'react';
import { useT } from '@/i18n';
import type { CommodityId } from '@/api/market.api';

const DEFAULT_WATCHLIST: CommodityId[] = ['irishPotatoes', 'tomatoes', 'redOnions', 'cabbage', 'carrots'];

/** Portfolio-style landing view: live ticker, tracked-commodity watchlist, and today's most active movers. */
export function DashboardTab() {
  const t = useT();
  const { colors } = useTheme();
  const dashboard = useMarketStore((s) => s.dashboard);
  const fetchDashboard = useMarketStore((s) => s.fetchDashboard);

  useEffect(() => { void fetchDashboard(); }, [fetchDashboard]);

  const watchlist = (dashboard?.watchlist ?? DEFAULT_WATCHLIST) as CommodityId[];
  const mostActive = (dashboard?.mostActive ?? DEFAULT_WATCHLIST.slice(0, 3)) as CommodityId[];

  return (
    <View>
      <CommodityTicker />
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('dashboard_watchlist')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {watchlist.map((commodityId) => (
          <ChartErrorBoundary key={commodityId}>
            <WatchlistCard commodityId={commodityId} />
          </ChartErrorBoundary>
        ))}
      </ScrollView>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('dashboard_mostActive')}</Text>
      {mostActive.map((commodityId) => (
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

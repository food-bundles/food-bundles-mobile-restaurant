import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { space, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { MarketScreenHeader } from './_components/MarketScreenHeader';
import { MarketTopTabSwitch } from './_components/MarketTopTabSwitch';
import { DashboardTab } from './_components/DashboardTab';
import { ChartsTab } from './_components/ChartsTab';
import { useMarketStore } from '@/stores';
import { useT } from '@/i18n';

type MarketTopTab = 'dashboard' | 'charts' | 'priceHistory';

export default function MarketPrices() {
  const t = useT();
  const { colors } = useTheme();
  const [topTab, setTopTab] = useState<MarketTopTab>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const dashboard = useMarketStore((s) => s.dashboard);
  const fetchDashboard = useMarketStore((s) => s.fetchDashboard);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const changePct = dashboard?.commodities.find((c) => c.id === 'irishPotatoes')?.changePct ?? 0;

  const onSelectTab = (tab: MarketTopTab) => {
    if (tab === 'priceHistory') {
      router.push('/(app)/market/price-comparison');
      return;
    }
    setTopTab(tab);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenScroll contentInsetBottom={space.xl}>
        <MarketScreenHeader
          minutesAgo={3}
          onRefresh={() => {
            useMarketStore.setState({ dashboard: null });
            setRefreshKey((k) => k + 1);
            void fetchDashboard();
          }}
          changePct={changePct}
        />
        <View style={styles.tabSwitchGap}>
          <MarketTopTabSwitch
            options={[
              { key: 'dashboard', label: t('dashboard_tabLabel') },
              { key: 'charts', label: t('dashboard_chartsTabLabel') },
              { key: 'priceHistory', label: t('priceHistory_tabLabel') },
            ]}
            active={topTab}
            onSelect={onSelectTab}
          />
        </View>
        {topTab === 'dashboard' ? <DashboardTab /> : <ChartsTab refreshKey={refreshKey} />}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabSwitchGap: { marginTop: space.md },
});

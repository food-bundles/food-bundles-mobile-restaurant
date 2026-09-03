import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { space, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { MarketScreenHeader } from './_components/MarketScreenHeader';
import { MarketTopTabSwitch } from './_components/MarketTopTabSwitch';
import { DashboardTab } from './_components/DashboardTab';
import { ChartsTab } from './_components/ChartsTab';
import { momentumChangePct } from '@/mocks';
import { useT } from '@/i18n';

const UPDATED_MINUTES_AGO = 3;

type MarketTopTab = 'dashboard' | 'charts' | 'priceHistory';

/** Market Prices screen: a Dashboard portfolio view, a Charts deep-dive view, and a Price History link. */
export default function MarketPrices() {
  const t = useT();
  const { colors } = useTheme();
  const [topTab, setTopTab] = useState<MarketTopTab>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const changePct = momentumChangePct('irishPotatoes');

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
          minutesAgo={UPDATED_MINUTES_AGO}
          onRefresh={() => setRefreshKey((key) => key + 1)}
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

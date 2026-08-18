import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { color, radius, shadow, space } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { useSessionStore } from '@/stores';
import {
  COMMODITIES,
  MARKET_COMPARISON,
  PRICE_HISTORY,
  TIME_RANGES,
  VOLUME_TREND,
  getPriceSeries,
  type CommodityId,
  type TimeRange,
} from '@/mocks';
import { MarketScreenHeader } from './_components/MarketScreenHeader';
import { CommodityChips } from './_components/CommodityChips';
import { PriceAreaChart } from './_components/PriceAreaChart';
import { TimeRangeTabs } from './_components/TimeRangeTabs';
import { MarketComparisonTable } from './_components/MarketComparisonTable';
import { AnalyticsCards } from './_components/AnalyticsCards';
import { TrackMarketToggle } from './_components/TrackMarketToggle';
import { weeklyAverage } from './_components/marketAnalytics';

const UPDATED_MINUTES_AGO = 3;

export default function MarketPrices() {
  const subscribed = useSessionStore((state) => state.subscribed);
  const [commodityId, setCommodityId] = useState<CommodityId>('irishPotatoes');
  const [range, setRange] = useState<TimeRange>('7D');
  const [refreshKey, setRefreshKey] = useState(0);

  const commodity = COMMODITIES.find((c) => c.id === commodityId) ?? COMMODITIES[0];
  const series = getPriceSeries(commodityId, range);
  const weeklyValues = PRICE_HISTORY[commodityId];
  const { changePct } = weeklyAverage(weeklyValues);
  const latestPrice = weeklyValues[weeklyValues.length - 1];
  const alertPrice = Math.round(latestPrice * 0.95);

  return (
    <View style={styles.container}>
      <ScreenScroll contentInsetBottom={space.xl}>
        <MarketScreenHeader
          minutesAgo={UPDATED_MINUTES_AGO}
          onRefresh={() => setRefreshKey((key) => key + 1)}
          changePct={changePct}
        />

        <View style={styles.section}>
          <CommodityChips options={COMMODITIES} selected={commodityId} onSelect={setCommodityId} />
        </View>

        <View style={[styles.section, styles.card]}>
          <PriceAreaChart
            key={`${commodityId}-${range}-${refreshKey}`}
            values={series.values}
            dayLabels={series.labels}
          />
          <View style={styles.rangeGap}>
            <TimeRangeTabs options={TIME_RANGES} selected={range} onSelect={setRange} />
          </View>
        </View>

        <View style={styles.section}>
          <MarketComparisonTable rows={MARKET_COMPARISON} latestPrice={latestPrice} commodity={commodityId} />
        </View>

        <View style={styles.section}>
          <AnalyticsCards priceHistory={weeklyValues} volumeHistory={VOLUME_TREND[commodityId]} />
        </View>

        <View style={[styles.section, styles.card]}>
          <TrackMarketToggle subscribed={subscribed} commodity={commodity.name} alertPrice={alertPrice} />
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  section: { marginTop: space.lg },
  card: {
    backgroundColor: color.paper,
    borderRadius: radius.lg,
    padding: space.lg,
    ...shadow.card,
  },
  rangeGap: { marginTop: space.md },
});

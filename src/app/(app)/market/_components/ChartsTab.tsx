import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { CommodityChips } from './CommodityChips';
import { PriceAreaChart } from './PriceAreaChart';
import { MovingAverageOverlay } from './MovingAverageOverlay';
import { TimeRangeTabs } from './TimeRangeTabs';
import { ChartTypeToggle, type ChartType } from './ChartTypeToggle';
import { CandlestickChart } from './CandlestickChart';
import { MaOverlayToggle } from './MaOverlayToggle';
import { MarketComparisonTable } from './MarketComparisonTable';
import { AnalyticsCards } from './AnalyticsCards';
import { TechnicalIndicatorsPanel } from './TechnicalIndicatorsPanel';
import { TrackMarketToggle } from './TrackMarketToggle';
import { MarketFeatureCard } from './MarketFeatureCard';
import { ComparePeriodsSheet } from './ComparePeriodsSheet';
import { PeriodComparisonChart } from './PeriodComparisonChart';
import { ChartErrorBoundary } from '@/components/market';
import { BasketIcon, TrendingUpIcon } from '@/components/icons';
import { useSessionStore, useMarketStore } from '@/stores';
import { useT } from '@/i18n';
import type { CommodityId } from '@/api/market.api';

const TIME_RANGES = ['1D', '7D', '1M', '3M'] as const;
type TimeRange = typeof TIME_RANGES[number];
type ComparisonPreset = 'WEEK' | 'MONTH' | 'QUARTER';

export interface ChartsTabProps {
  refreshKey: number;
}

export function ChartsTab({ refreshKey }: ChartsTabProps) {
  const t = useT();
  const { colors } = useTheme();
  const subscribed = useSessionStore((state) => state.subscribed);
  const dashboard = useMarketStore((s) => s.dashboard);
  const fetchSeries = useMarketStore((s) => s.fetchSeries);
  const seriesCache = useMarketStore((s) => s.seriesCache);

  const [commodityId, setCommodityId] = useState<CommodityId>('irishPotatoes');
  const [range, setRange] = useState<TimeRange>('7D');
  const [chartType, setChartType] = useState<ChartType>('LINE');
  const [showMa, setShowMa] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePreset, setComparePreset] = useState<ComparisonPreset>('WEEK');

  const apiCommodity = dashboard?.commodities.find((c) => c.id === commodityId);
  const commodities = dashboard?.commodities ?? [];

  const seriesKey = `${commodityId}-${range}`;
  const cachedSeries = seriesCache[seriesKey];

  const priceHistory = cachedSeries?.series.map((s) => s.price)
    ?? apiCommodity?.history.map((h) => h.price)
    ?? [];

  const latestPrice = apiCommodity?.latestPrice ?? (priceHistory[priceHistory.length - 1] ?? 0);
  const alertPrice = Math.round(latestPrice * 0.95);
  const ohlcData = cachedSeries?.ohlc ?? apiCommodity?.ohlc ?? [];
  const rsiValue = cachedSeries?.rsi ?? apiCommodity?.rsi ?? 50;
  const momentumData = apiCommodity?.momentum ?? { direction: 'FLAT' as const, magnitudePct: 0 };
  const changePct = apiCommodity?.changePct ?? 0;

  const comparisonRows = cachedSeries?.comparison ?? [];

  // Dummy comparison series from price history split in half
  const half = Math.ceil(priceHistory.length / 2);
  const comparisonCurrent = priceHistory.slice(half);
  const comparisonPrevious = priceHistory.slice(0, half);

  useEffect(() => {
    void fetchSeries(commodityId, range);
  }, [commodityId, range, fetchSeries]);

  const dayLabels = range === '1D' ? ['12 AM', 'Now']
    : range === '7D' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : range === '1M' ? ['W1', 'W2', 'W3', 'W4']
    : ['M1', 'M2', 'M3'];

  return (
    <View>
      <View style={styles.section}>
        <CommodityChips options={commodities} selected={commodityId} onSelect={setCommodityId} />
      </View>

      <View style={[styles.section, styles.card, { backgroundColor: colors.paper }]}>
        <ChartTypeToggle active={chartType} onSelect={setChartType} />
        <View style={styles.chartGap}>
          <ChartErrorBoundary key={`${commodityId}-${range}-${refreshKey}-${chartType}`}>
            {chartType === 'LINE' ? (
              <View>
                <PriceAreaChart values={priceHistory} dayLabels={dayLabels} />
                {showMa ? <MovingAverageOverlay values={priceHistory} /> : null}
              </View>
            ) : (
              <CandlestickChart candles={ohlcData} />
            )}
          </ChartErrorBoundary>
        </View>
        <MaOverlayToggle enabled={showMa} onToggle={() => setShowMa((prev) => !prev)} />
        <View style={styles.rangeGap}>
          <TimeRangeTabs options={TIME_RANGES} selected={range} onSelect={setRange} />
        </View>
      </View>

      <TechnicalIndicatorsPanel
        commodityName={apiCommodity?.name ?? commodityId}
        rsi={rsiValue}
        momentum={momentumData}
      />

      <View style={[styles.section, styles.card, { backgroundColor: colors.paper }]}>
        <View style={styles.compareHeaderRow}>
          <Text style={[styles.compareTitle, { color: colors.ink }]}>{t('compare_title')}</Text>
          <Pressable
            onPress={() => setCompareOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={t('compare_openButton')}
            style={styles.compareOpenHit}
          >
            <Text style={[styles.compareOpenLabel, { color: colors.leaf }]}>{t('compare_openButton')}</Text>
          </Pressable>
        </View>
        <ChartErrorBoundary>
          <PeriodComparisonChart current={comparisonCurrent} previous={comparisonPrevious} />
        </ChartErrorBoundary>
      </View>

      <View style={styles.section}>
        <MarketFeatureCard
          icon={<BasketIcon color={colors.leaf} />}
          title={t('advisor_menuGeneratorTitle')}
          subtitle={t('advisor_menuGeneratorSubtitle')}
          onPress={() => router.push('/(app)/market/menu-generator')}
        />
      </View>

      <View style={styles.section}>
        <MarketFeatureCard
          icon={<TrendingUpIcon color={colors.leaf} />}
          title={t('advisor_smartBuyingTips')}
          subtitle={t('advisor_smartBuyingTipsSubtitle')}
          onPress={() => router.push('/(app)/market/purchase-advisor')}
        />
      </View>

      {comparisonRows.length > 0 ? (
        <View style={styles.section}>
          <MarketComparisonTable rows={comparisonRows} latestPrice={latestPrice} commodity={commodityId} />
        </View>
      ) : null}

      <View style={styles.section}>
        <AnalyticsCards
          commodityId={commodityId}
          priceHistory={priceHistory}
          changePct={changePct}
        />
      </View>

      <View style={[styles.section, styles.card, { backgroundColor: colors.paper }]}>
        <TrackMarketToggle subscribed={subscribed} commodity={apiCommodity?.name ?? commodityId} alertPrice={alertPrice} />
      </View>

      <ComparePeriodsSheet
        visible={compareOpen}
        selected={comparePreset}
        onSelect={(preset) => { setComparePreset(preset); setCompareOpen(false); }}
        onClose={() => setCompareOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: space.lg },
  card: { borderRadius: radius.lg, padding: space.lg, ...shadow.card },
  chartGap: { marginTop: space.sm },
  rangeGap: { marginTop: space.md },
  compareHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  compareTitle: { ...text.h2 },
  compareOpenHit: { minHeight: hit.min, justifyContent: 'center' },
  compareOpenLabel: { ...text.label },
});

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { CommodityChips } from './CommodityChips';
import { PriceAreaChart } from './PriceAreaChart';
import { MovingAverageOverlay } from './MovingAverageOverlay';
import { TimeRangeTabs } from './TimeRangeTabs';
import { ChartTypeToggle, type ChartType } from './ChartTypeToggle';
import { CandlestickChart } from './CandlestickChart';
import { VolumeBars } from './VolumeBars';
import { MaOverlayToggle } from './MaOverlayToggle';
import { MarketComparisonTable } from './MarketComparisonTable';
import { AnalyticsCards } from './AnalyticsCards';
import { TechnicalIndicatorsPanel } from './TechnicalIndicatorsPanel';
import { TrackMarketToggle } from './TrackMarketToggle';
import { MarketFeatureCard } from './MarketFeatureCard';
import { ComparePeriodsSheet } from './ComparePeriodsSheet';
import { PeriodComparisonChart } from './PeriodComparisonChart';
import { BasketIcon, TrendingUpIcon } from '@/components/icons';
import { useSessionStore } from '@/stores';
import {
  COMMODITIES,
  MARKET_COMPARISON,
  PRICE_HISTORY,
  TIME_RANGES,
  VOLUME_TREND,
  OHLC_HISTORY,
  RSI_VALUES,
  MOMENTUM,
  COMPARISON_SERIES,
  getPriceSeries,
  type CommodityId,
  type TimeRange,
  type ComparisonPreset,
} from '@/mocks';
import { useT } from '@/i18n';

export interface ChartsTabProps {
  refreshKey: number;
}

/** The commodity deep-dive tab: line/candle chart, volume, MA overlay, indicators, and period comparison. */
export function ChartsTab({ refreshKey }: ChartsTabProps) {
  const t = useT();
  const { colors } = useTheme();
  const subscribed = useSessionStore((state) => state.subscribed);
  const [commodityId, setCommodityId] = useState<CommodityId>('irishPotatoes');
  const [range, setRange] = useState<TimeRange>('7D');
  const [chartType, setChartType] = useState<ChartType>('LINE');
  const [showMa, setShowMa] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePreset, setComparePreset] = useState<ComparisonPreset>('MONTH');

  const commodity = COMMODITIES.find((c) => c.id === commodityId) ?? COMMODITIES[0];
  const series = getPriceSeries(commodityId, range);
  const weeklyValues = PRICE_HISTORY[commodityId];
  const latestPrice = weeklyValues[weeklyValues.length - 1];
  const alertPrice = Math.round(latestPrice * 0.95);

  return (
    <View>
      <View style={styles.section}>
        <CommodityChips options={COMMODITIES} selected={commodityId} onSelect={setCommodityId} />
      </View>

      <View style={[styles.section, styles.card, { backgroundColor: colors.paper }]}>
        <ChartTypeToggle active={chartType} onSelect={setChartType} />
        <View style={styles.chartGap}>
          {chartType === 'LINE' ? (
            <View>
              <PriceAreaChart
                key={`${commodityId}-${range}-${refreshKey}`}
                values={series.values}
                dayLabels={series.labels}
              />
              {showMa ? <MovingAverageOverlay values={series.values} /> : null}
            </View>
          ) : (
            <CandlestickChart candles={OHLC_HISTORY[commodityId]} />
          )}
        </View>
        <MaOverlayToggle enabled={showMa} onToggle={() => setShowMa((prev) => !prev)} />
        <View style={styles.volumeGap}>
          <VolumeBars volumes={VOLUME_TREND[commodityId]} />
        </View>
        <View style={styles.rangeGap}>
          <TimeRangeTabs options={TIME_RANGES} selected={range} onSelect={setRange} />
        </View>
      </View>

      <TechnicalIndicatorsPanel
        commodityName={commodity.name}
        rsi={RSI_VALUES[commodityId]}
        momentum={MOMENTUM[commodityId]}
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
        <PeriodComparisonChart
          current={COMPARISON_SERIES[comparePreset].current}
          previous={COMPARISON_SERIES[comparePreset].previous}
        />
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

      <View style={styles.section}>
        <MarketComparisonTable rows={MARKET_COMPARISON} latestPrice={latestPrice} commodity={commodityId} />
      </View>

      <View style={styles.section}>
        <AnalyticsCards priceHistory={weeklyValues} volumeHistory={VOLUME_TREND[commodityId]} />
      </View>

      <View style={[styles.section, styles.card, { backgroundColor: colors.paper }]}>
        <TrackMarketToggle subscribed={subscribed} commodity={commodity.name} alertPrice={alertPrice} />
      </View>

      <ComparePeriodsSheet
        visible={compareOpen}
        selected={comparePreset}
        onSelect={(preset) => {
          setComparePreset(preset);
          setCompareOpen(false);
        }}
        onClose={() => setCompareOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: space.lg },
  card: { borderRadius: radius.lg, padding: space.lg, ...shadow.card },
  chartGap: { marginTop: space.sm },
  volumeGap: { marginTop: space.md },
  rangeGap: { marginTop: space.md },
  compareHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  compareTitle: { ...text.h2 },
  compareOpenHit: { minHeight: hit.min, justifyContent: 'center' },
  compareOpenLabel: { ...text.label },
});

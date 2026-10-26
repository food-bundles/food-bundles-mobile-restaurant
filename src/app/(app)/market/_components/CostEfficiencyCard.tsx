import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { PriceAreaChart } from './PriceAreaChart';
import { formatRwf } from '@/lib';
import { useMarketStore } from '@/stores';
import { useT } from '@/i18n';

const TREND_WEEK_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];

/** Compares the restaurant's ingredient cost per cover against the peer median, with a 7-week trend chart. */
export function CostEfficiencyCard() {
  const t = useT();
  const { colors } = useTheme();
  const ranking = useMarketStore((s) => s.ranking);
  const yourCost = ranking?.yourCostPerCover ?? 0;
  const peerMedian = ranking?.peerMedianCostPerCover ?? 0;
  const trend = ranking?.costPerCoverTrend ?? [];
  const efficiencyPct = peerMedian > 0 ? Math.round(((peerMedian - yourCost) / peerMedian) * 100) : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('ranking_costEfficiencyTitle')}</Text>
      <Text style={[styles.yourCost, { color: colors.ink }]}>
        {t('ranking_yourCostPerCover', { amount: formatRwf(yourCost) })}
      </Text>
      <Text style={[styles.peerMedian, { color: colors.leaf }]}>
        {t('ranking_peerMedianMoreEfficient', { amount: formatRwf(peerMedian), percent: efficiencyPct })}
      </Text>
      <Text style={[styles.trendLabel, { color: colors.secondary }]}>{t('ranking_costTrendTitle')}</Text>
      <View style={styles.chartGap}>
        <PriceAreaChart values={trend} dayLabels={TREND_WEEK_LABELS} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md, ...shadow.card },
  title: { ...text.h2 },
  yourCost: { ...text.priceLg, marginTop: space.sm },
  peerMedian: { ...text.body, marginTop: space.xs },
  trendLabel: { ...text.overline, marginTop: space.lg },
  chartGap: { marginTop: space.sm },
});

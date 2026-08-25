import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { Sparkline } from './Sparkline';
import { formatRwf } from '@/lib';
import { YOUR_COST_PER_COVER, PEER_MEDIAN_COST_PER_COVER, COST_PER_COVER_TREND } from '@/mocks';
import { useT } from '@/i18n';

/** Compares the restaurant's ingredient cost per cover against the peer median, with a 7-week trend. */
export function CostEfficiencyCard() {
  const t = useT();
  const { colors } = useTheme();
  const efficiencyPct = Math.round(
    ((PEER_MEDIAN_COST_PER_COVER - YOUR_COST_PER_COVER) / PEER_MEDIAN_COST_PER_COVER) * 100,
  );

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('ranking_costEfficiencyTitle')}</Text>
      <Text style={[styles.yourCost, { color: colors.ink }]}>
        {t('ranking_yourCostPerCover', { amount: formatRwf(YOUR_COST_PER_COVER) })}
      </Text>
      <Text style={[styles.peerMedian, { color: colors.leaf }]}>
        {t('ranking_peerMedianMoreEfficient', { amount: formatRwf(PEER_MEDIAN_COST_PER_COVER), percent: efficiencyPct })}
      </Text>
      <View style={styles.sparklineGap}>
        <Sparkline values={COST_PER_COVER_TREND} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md, ...shadow.card },
  title: { ...text.h2 },
  yourCost: { ...text.priceLg, marginTop: space.sm },
  peerMedian: { ...text.body, marginTop: space.xs },
  sparklineGap: { marginTop: space.md },
});

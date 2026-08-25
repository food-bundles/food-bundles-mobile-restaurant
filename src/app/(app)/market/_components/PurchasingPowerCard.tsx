import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { PercentileBar } from './PercentileBar';
import { formatRwf, computePercentile } from '@/lib';
import { PEER_MONTHLY_VOLUMES, YOUR_MONTHLY_VOLUME, PEER_AVG_ORDER_SIZE, YOUR_AVG_ORDER_SIZE } from '@/mocks';
import { useT } from '@/i18n';

/** Ranks the restaurant's monthly purchase volume against anonymous Kigali peers. */
export function PurchasingPowerCard() {
  const t = useT();
  const { colors } = useTheme();
  const percentile = computePercentile(YOUR_MONTHLY_VOLUME, PEER_MONTHLY_VOLUMES);
  const topPercent = 100 - percentile;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('ranking_purchasingPowerTitle')}</Text>
      <PercentileBar percentile={percentile} />
      <Text style={[styles.summary, { color: colors.leaf }]}>
        {t('ranking_topPercent', { percent: topPercent })}
      </Text>
      <View style={[styles.compareRow, { borderTopColor: colors.hairline }]}>
        <Text style={[styles.compareLabel, { color: colors.secondary }]}>{t('ranking_yourAvgOrder')}</Text>
        <Text style={[styles.compareValue, { color: colors.ink }]}>{formatRwf(YOUR_AVG_ORDER_SIZE)}</Text>
      </View>
      <View style={styles.compareRow}>
        <Text style={[styles.compareLabel, { color: colors.secondary }]}>{t('ranking_peerAvgOrder')}</Text>
        <Text style={[styles.compareValue, { color: colors.secondary }]}>{formatRwf(PEER_AVG_ORDER_SIZE)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md, ...shadow.card },
  title: { ...text.h2 },
  summary: { ...text.bodySemi, marginTop: space.sm },
  compareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: space.sm,
    marginTop: space.sm,
    borderTopWidth: 1,
  },
  compareLabel: { ...text.caption },
  compareValue: { ...text.caption, fontVariant: ['tabular-nums'] },
});

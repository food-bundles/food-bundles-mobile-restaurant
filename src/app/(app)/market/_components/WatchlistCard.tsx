import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { Sparkline } from './Sparkline';
import { formatRwf } from '@/lib';
import { useMarketStore } from '@/stores';
import type { CommodityId } from '@/api/market.api';

export interface WatchlistCardProps {
  commodityId: CommodityId;
}

/** Compact tracked-commodity card: 7-day mini sparkline, today's price, and a 24h change badge. */
export function WatchlistCard({ commodityId }: WatchlistCardProps) {
  const { colors } = useTheme();
  const dashboard = useMarketStore((s) => s.dashboard);
  const apiCommodity = dashboard?.commodities.find((c) => c.id === commodityId);

  if (!apiCommodity) return null;

  const history = apiCommodity.history.map((h) => h.price);
  const todayPrice = apiCommodity.latestPrice;
  const changePct = apiCommodity.changePct;
  const isUp = changePct >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.name, { color: colors.ink }]}>{apiCommodity.name}</Text>
      <View style={styles.sparklineGap}>
        <Sparkline values={history} />
      </View>
      <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(todayPrice)}</Text>
      <Badge
        tone={isUp ? 'ripe' : 'chili'}
        label={`${isUp ? '+' : '−'}${Math.abs(changePct).toFixed(1)}%`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 128, borderRadius: radius.lg, padding: space.md, marginRight: space.sm, ...shadow.card },
  name: { ...text.label },
  sparklineGap: { marginTop: space.sm },
  price: { ...text.bodySemi, marginTop: space.sm, fontVariant: ['tabular-nums'] },
});

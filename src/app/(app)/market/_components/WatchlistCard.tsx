import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { Sparkline } from './Sparkline';
import { formatRwf } from '@/lib';
import { COMMODITIES, PRICE_HISTORY, momentumChangePct, type CommodityId } from '@/mocks';

export interface WatchlistCardProps {
  commodityId: CommodityId;
}

/** Compact tracked-commodity card: 7-day mini sparkline, today's price, and a 24h change badge. */
export function WatchlistCard({ commodityId }: WatchlistCardProps) {
  const { colors } = useTheme();
  const commodity = COMMODITIES.find((c) => c.id === commodityId);
  if (!commodity) return null;

  const history = PRICE_HISTORY[commodityId];
  const todayPrice = history[history.length - 1];
  const changePct = momentumChangePct(commodityId);
  const isUp = changePct >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.name, { color: colors.ink }]}>{commodity.name}</Text>
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

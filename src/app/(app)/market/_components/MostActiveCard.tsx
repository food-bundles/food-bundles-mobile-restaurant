import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { COMMODITIES, PRICE_HISTORY, type CommodityId } from '@/mocks';
import { weeklyAverage } from './marketAnalytics';

export interface MostActiveCardProps {
  commodityId: CommodityId;
}

const THUMB_WIDTH = 220;
const THUMB_HEIGHT = 56;

function buildAreaPath(values: number[]): string {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = THUMB_WIDTH / (values.length - 1);
  const points = values.map((value, index) => ({
    x: index * step,
    y: THUMB_HEIGHT - ((value - min) / range) * THUMB_HEIGHT,
  }));
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  return `${line} L ${THUMB_WIDTH} ${THUMB_HEIGHT} L 0 ${THUMB_HEIGHT} Z`;
}

/** One "most active today" commodity: a full area-chart thumbnail with today's price and change. */
export function MostActiveCard({ commodityId }: MostActiveCardProps) {
  const { colors } = useTheme();
  const commodity = COMMODITIES.find((c) => c.id === commodityId);
  if (!commodity) return null;

  const history = PRICE_HISTORY[commodityId];
  const todayPrice = history[history.length - 1];
  const { changePct } = weeklyAverage(history);
  const isUp = changePct >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: colors.ink }]}>{commodity.name}</Text>
        <Text style={[styles.change, { color: isUp ? colors.tintedGreenText : colors.tintedRedText }]}>
          {isUp ? '+' : '−'}
          {Math.abs(changePct).toFixed(1)}%
        </Text>
      </View>
      <Svg width={THUMB_WIDTH} height={THUMB_HEIGHT} viewBox={`0 0 ${THUMB_WIDTH} ${THUMB_HEIGHT}`}>
        <Path d={buildAreaPath(history)} fill={isUp ? colors.tintLeaf : colors.tintChili} />
      </Svg>
      <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(todayPrice)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.md, marginBottom: space.sm, ...shadow.card },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.xs },
  name: { ...text.bodySemi },
  change: { ...text.label, fontVariant: ['tabular-nums'] },
  price: { ...text.bodySemi, marginTop: space.xs, fontVariant: ['tabular-nums'] },
});

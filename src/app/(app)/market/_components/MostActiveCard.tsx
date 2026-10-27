import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { PRODUCT_IMAGES } from '@/constants/productImages';
import { useMarketStore } from '@/stores';
import { guardSeries } from './chartMath';
import type { CommodityId } from '@/api/market.api';

export interface MostActiveCardProps {
  commodityId: CommodityId;
}

const THUMB_WIDTH = 220;
const THUMB_HEIGHT = 56;
const PHOTO_HEIGHT = 56;
const GRADIENT_ID = 'mostActiveGradient';

const COMMODITY_IMAGE: Record<CommodityId, any> = {
  irishPotatoes: PRODUCT_IMAGES.irishPotatoes,
  tomatoes: PRODUCT_IMAGES.freshTomatoes,
  redOnions: PRODUCT_IMAGES.redOnions,
  cabbage: PRODUCT_IMAGES.cabbage,
  carrots: PRODUCT_IMAGES.carrots,
};

function buildAreaPath(values: number[]): string {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = THUMB_WIDTH / (values.length - 1 || 1);
  const points = values.map((value, index) => ({
    x: index * step,
    y: THUMB_HEIGHT - ((value - min) / range) * THUMB_HEIGHT,
  }));
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  return `${line} L ${THUMB_WIDTH} ${THUMB_HEIGHT} L 0 ${THUMB_HEIGHT} Z`;
}

/** One "most active today" commodity: full-bleed photo, gradient area-chart thumbnail, price and change badge. */
export function MostActiveCard({ commodityId }: MostActiveCardProps) {
  const { colors } = useTheme();
  const dashboard = useMarketStore((s) => s.dashboard);
  const apiCommodity = dashboard?.commodities.find((c) => c.id === commodityId);

  if (!apiCommodity) return null;

  const history = guardSeries(apiCommodity.history.map((h) => h.price));
  const todayPrice = apiCommodity.latestPrice;
  const changePct = apiCommodity.changePct;
  const isUp = changePct >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Image
        source={COMMODITY_IMAGE[commodityId]}
        style={styles.photo}
        accessibilityLabel={apiCommodity.name}
        resizeMode="cover"
      />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: colors.ink }]}>{apiCommodity.name}</Text>
          <View style={[styles.changeBadge, { backgroundColor: isUp ? colors.ripe : colors.chili }]}>
            <Text style={[styles.changeLabel, { color: colors.paper }]}>
              {isUp ? '+' : '−'}{Math.abs(changePct).toFixed(1)}%
            </Text>
          </View>
        </View>
        <Svg width={THUMB_WIDTH} height={THUMB_HEIGHT} viewBox={`0 0 ${THUMB_WIDTH} ${THUMB_HEIGHT}`}>
          <Defs>
            <LinearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.leaf} stopOpacity={0.25} />
              <Stop offset="1" stopColor={colors.leaf} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={buildAreaPath(history)} fill={`url(#${GRADIENT_ID})`} />
        </Svg>
        <Text style={[styles.price, { color: colors.ink }]}>{formatRwf(todayPrice)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, marginBottom: space.sm, overflow: 'hidden', ...shadow.card },
  photo: { width: '100%', height: PHOTO_HEIGHT },
  body: { padding: space.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.xs },
  name: { ...text.bodySemi },
  changeBadge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 2 },
  changeLabel: { ...text.micro, fontVariant: ['tabular-nums'] },
  price: { ...text.bodySemi, marginTop: space.xs, fontVariant: ['tabular-nums'] },
});

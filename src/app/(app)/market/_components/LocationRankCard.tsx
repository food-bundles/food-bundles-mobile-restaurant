import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { NEARBY_MARKET_PRICES, MARKETS_WITHIN_REACH, TOTAL_MARKETS_TRACKED, YOUR_LOCATION, products } from '@/mocks';
import { useT } from '@/i18n';

/** Static map thumbnail + nearby market price comparison for the restaurant's location. */
export function LocationRankCard() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('ranking_locationTitle')}</Text>
      <View style={[styles.mapWrap, { backgroundColor: colors.mapLand }]}>
        <Svg width="100%" height={90} viewBox="0 0 200 90">
          <Rect x={0} y={40} width={200} height={20} fill={colors.mapWater} opacity={0.5} />
          <Circle cx={100} cy={45} r={7} fill={colors.leaf} />
          <Circle cx={40} cy={20} r={4} fill={colors.mapBuildings} />
          <Circle cx={160} cy={65} r={4} fill={colors.mapBuildings} />
          <Circle cx={130} cy={20} r={4} fill={colors.mapBuildings} />
          <Circle cx={60} cy={70} r={4} fill={colors.mapBuildings} />
        </Svg>
      </View>
      <Text style={[styles.summary, { color: colors.ink }]}>
        {t('ranking_locationSummary', {
          location: YOUR_LOCATION,
          reachable: MARKETS_WITHIN_REACH,
          total: TOTAL_MARKETS_TRACKED,
        })}
      </Text>
      {NEARBY_MARKET_PRICES.map((entry, index) => {
        const product = products.find((p) => p.id === entry.productId);
        if (!product) return null;
        return (
          <View key={`${entry.marketName}-${entry.productId}-${index}`} style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.secondary }]}>
              {entry.marketName} · {product.name}
            </Text>
            <Text style={[styles.priceValue, { color: colors.ink }]}>{formatRwf(entry.price)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md, ...shadow.card },
  title: { ...text.h2 },
  mapWrap: { borderRadius: radius.md, overflow: 'hidden', marginTop: space.sm },
  summary: { ...text.body, marginTop: space.sm },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  priceLabel: { ...text.caption },
  priceValue: { ...text.caption, fontVariant: ['tabular-nums'] },
});

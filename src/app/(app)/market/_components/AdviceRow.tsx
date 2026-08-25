import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { ProductLineImage } from '@/components/product';
import { formatRwf } from '@/lib';
import type { BuyingAdviceItem } from '@/lib';
import { products } from '@/mocks';
import { useT } from '@/i18n';

export interface AdviceRowProps {
  item: BuyingAdviceItem;
  productId: string;
  onAction: () => void;
}

/** One commodity row inside a Purchase Advisor card: today's price, weekly average and the delta badge. */
export function AdviceRow({ item, productId, onAction }: AdviceRowProps) {
  const t = useT();
  const { colors } = useTheme();
  const product = products.find((p) => p.id === productId);
  const isSaving = item.changeFraction < 0;
  const deltaPct = `${isSaving ? '−' : '+'}${Math.abs(item.changeFraction * 100).toFixed(1)}%`;

  return (
    <View style={styles.row}>
      {product ? <ProductLineImage source={product.image} label={item.name} /> : null}
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: colors.ink }]}>{item.name}</Text>
        <Text style={[styles.priceLine, { color: colors.secondary }]}>
          {t('advisor_today', { price: formatRwf(item.todayPrice) })}
        </Text>
        <Text style={[styles.priceLine, { color: colors.secondary }]}>
          {t('advisor_weeklyAvg', { price: formatRwf(item.weeklyAveragePrice) })}
        </Text>
        <View style={styles.badgeGap}>
          <Badge tone={isSaving ? 'ripe' : 'chili'} label={deltaPct} />
        </View>
      </View>
      <Pressable
        onPress={onAction}
        accessibilityRole="button"
        accessibilityLabel={isSaving ? t('advisor_addToCart') : t('advisor_setPriceAlert')}
        style={styles.actionHit}
      >
        <Text style={[styles.actionLabel, { color: colors.leaf }]}>
          {isSaving ? t('advisor_addToCart') : t('advisor_setPriceAlert')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, paddingVertical: space.sm },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  priceLine: { ...text.caption, marginTop: 2 },
  badgeGap: { marginTop: space.xs },
  actionHit: { minHeight: hit.min, justifyContent: 'center', paddingHorizontal: space.xs },
  actionLabel: { ...text.label },
});

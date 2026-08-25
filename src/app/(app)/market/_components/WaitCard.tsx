import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { AdviceRow } from './AdviceRow';
import { useNotificationsStore } from '@/stores';
import { COMMODITY_PRODUCT_ID, type BuyingAdviceItem } from '@/lib';
import { useT } from '@/i18n';

export interface WaitCardProps {
  items: BuyingAdviceItem[];
}

/** Lists commodities priced well above their 7-day average, with a one-tap price-alert per row. */
export function WaitCard({ items }: WaitCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const setPriceAlert = useNotificationsStore((state) => state.setPriceAlert);

  if (items.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('advisor_waitIfYouCan')}</Text>
      {items.slice(0, 4).map((item) => (
        <AdviceRow
          key={item.commodityId}
          item={item}
          productId={COMMODITY_PRODUCT_ID[item.commodityId]}
          onAction={() =>
            setPriceAlert(COMMODITY_PRODUCT_ID[item.commodityId], Math.round(item.weeklyAveragePrice), 'below')
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: radius.lg,
    padding: space.md,
    marginRight: space.sm,
    ...shadow.card,
  },
  title: { ...text.overline },
});

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { useNotificationsStore } from '@/stores';
import { COMMODITY_PRODUCT_ID, type BuyingAdviceItem } from '@/lib';
import { products } from '@/mocks';
import { useT } from '@/i18n';

export interface WaitCardProps {
  items: BuyingAdviceItem[];
}

const PHOTO_SIZE = 80;

/** Section B "Wait if you can": a compact 2-column grid with a set-alert action per item. */
export function WaitCard({ items }: WaitCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const setPriceAlert = useNotificationsStore((state) => state.setPriceAlert);

  if (items.length === 0) return null;

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('advisor_waitIfYouCan')}</Text>
      <View style={styles.grid}>
        {items.slice(0, 4).map((item) => {
          const productId = COMMODITY_PRODUCT_ID[item.commodityId];
          const product = products.find((p) => p.id === productId);
          const deltaPct = `+${Math.abs(item.changeFraction * 100).toFixed(1)}%`;

          return (
            <View key={item.commodityId} style={[styles.card, { backgroundColor: colors.paper }]}>
              {product ? (
                <Image source={product.image} style={styles.photo} accessibilityLabel={item.name} resizeMode="cover" />
              ) : null}
              <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.price, { color: colors.chili }]}>
                {formatRwf(item.todayPrice)} {deltaPct}
              </Text>
              <Pressable
                onPress={() => setPriceAlert(productId, Math.round(item.weeklyAveragePrice), 'below')}
                accessibilityRole="button"
                accessibilityLabel={t('advisor_setPriceAlert')}
                style={styles.alertHit}
              >
                <Text style={[styles.alertLabel, { color: colors.leaf }]}>{t('advisor_setPriceAlert')}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  card: { width: '47%', borderRadius: radius.md, padding: space.sm, ...shadow.card },
  photo: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: radius.sm, marginBottom: space.xs },
  name: { ...text.label },
  price: { ...text.caption, marginTop: 2, fontVariant: ['tabular-nums'] },
  alertHit: { minHeight: hit.min, justifyContent: 'center' },
  alertLabel: { ...text.micro },
});

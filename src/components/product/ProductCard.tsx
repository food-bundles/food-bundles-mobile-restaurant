import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, shadow, space, text } from '@/theme';
import type { Product } from '@/mocks/types';
import { useT } from '@/i18n';
import { PriceText } from './PriceText';
import { QuantityStepper } from './QuantityStepper';

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
  qty?: number;
  onInc?: () => void;
  onDec?: () => void;
}

export function ProductCard({ product, onPress, onAdd, qty = 0, onInc, onDec }: ProductCardProps) {
  const t = useT();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.unit}`}
      style={styles.container}
    >
      <Image source={product.image} accessible={false} style={styles.image} />
      {product.wasPrice ? (
        <View style={styles.discountBadge}>
          <Text style={styles.discountLabel}>{t('shop_sale')}</Text>
        </View>
      ) : null}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.unit}>{product.unit}</Text>
        <View style={styles.priceRow}>
          <PriceText amount={product.price} size="md" />
          {product.wasPrice ? (
            <Text style={styles.wasPrice}>
              {t('shop_wasPrice', { amount: product.wasPrice.toLocaleString('en-US') })}
            </Text>
          ) : null}
        </View>
      </View>
      {qty > 0 && onInc && onDec ? (
        <View style={styles.stepperWrap}>
          <QuantityStepper qty={qty} onInc={onInc} onDec={onDec} />
        </View>
      ) : (
        <Pressable
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t('shop_addToCartFor', { name: product.name })}
          style={styles.addButton}
        >
          <Text style={styles.addLabel}>{t('shop_add')}</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.paper,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  image: { width: '100%', height: 96, backgroundColor: color.neutral },
  discountBadge: {
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    backgroundColor: color.chili,
    borderRadius: radius.sm,
    paddingHorizontal: space.xs,
    paddingVertical: 2,
  },
  discountLabel: { ...text.micro, color: color.paper },
  body: { padding: space.md, gap: 2 },
  name: { ...text.bodySemi, color: color.ink },
  unit: { ...text.caption, color: color.muted },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.xs, marginTop: 2 },
  wasPrice: { ...text.caption, color: color.muted, textDecorationLine: 'line-through' },
  addButton: {
    minHeight: hit.min,
    marginHorizontal: space.md,
    marginBottom: space.md,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: { ...text.bodySemi, color: color.paper },
  stepperWrap: {
    marginHorizontal: space.md,
    marginBottom: space.md,
    alignItems: 'center',
  },
});

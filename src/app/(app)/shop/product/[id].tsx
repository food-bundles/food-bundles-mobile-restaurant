import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon, BasketIcon } from '@/components/icons';
import { PriceText, QuantityStepper } from '@/components/product';
import { products } from '@/mocks';
import { useCartStore } from '@/stores';
import { useT } from '@/i18n';

export default function ProductDetail() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const cartItemCount = useCartStore((state) => state.itemCount());
  const add = useCartStore((state) => state.add);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const onAddToCart = () => {
    for (let i = 0; i < qty; i += 1) add(product.id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Image source={product.image} accessible accessibilityLabel={product.name} style={styles.heroImage} />
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.heroButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Pressable
          onPress={() => router.push('/(app)/shop/cart')}
          accessibilityRole="button"
          accessibilityLabel={t('shop_openCart')}
          style={styles.heroButtonRightPosition}
        >
          <BasketIcon />
          {cartItemCount > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeLabel}>{cartItemCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
      <ScreenScroll contentInsetBottom={100}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.unit}>{product.unit}</Text>
        <View style={styles.priceRow}>
          <PriceText amount={product.price} size="hero" />
          <Text style={styles.perUnit}>/ {product.unit}</Text>
        </View>
        <Text style={styles.yourPrice}>{t('shop_yourPrice')}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.stockBadge}>
            <View style={styles.stockDot} />
            <Text style={styles.stockLabel}>{t('shop_inStock')}</Text>
          </View>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryLabel}>{t('shop_nextDay')}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          Firm, ripe field produce sorted for consistency — ideal for prep in volume. Sourced from
          cooperatives around Musanze.
        </Text>
        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>{t('shop_quantity')}</Text>
          <QuantityStepper qty={qty} onInc={() => setQty((q) => q + 1)} onDec={() => setQty((q) => Math.max(1, q - 1))} />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.subtotalLabel}>{t('shop_subtotal')}</Text>
            <PriceText amount={product.price * qty} size="md" />
          </View>
          <Pressable
            onPress={onAddToCart}
            accessibilityRole="button"
            accessibilityLabel={t('shop_addToCart')}
            style={styles.addButton}
          >
            <Text style={styles.addLabel}>{t('shop_addToCart')}</Text>
          </Pressable>
        </View>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  hero: { height: 220, backgroundColor: color.neutral, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroButton: {
    position: 'absolute',
    top: space.md,
    left: space.md,
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonRightPosition: {
    position: 'absolute',
    top: space.md,
    right: space.md,
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: color.marigold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeLabel: { ...text.micro, color: color.pine },
  name: { ...text.h1, color: color.ink, marginTop: space.md },
  unit: { ...text.caption, color: color.secondary, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm, marginTop: space.md },
  perUnit: { ...text.caption, color: color.secondary },
  yourPrice: { ...text.caption, color: color.muted, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: space.sm, marginTop: space.md },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: color.tintRipe,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  stockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.ripe },
  stockLabel: { ...text.label, color: color.tintedGreenText },
  deliveryBadge: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  deliveryLabel: { ...text.label, color: color.secondary },
  description: { ...text.body, color: color.body, marginTop: space.md, lineHeight: 20 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  quantityLabel: { ...text.bodySemi, color: color.ink },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  subtotalLabel: { ...text.caption, color: color.secondary },
  addButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: { ...text.bodySemi, color: color.paper },
});

import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon, BasketIcon } from '@/components/icons';
import { PriceText, QuantityStepper } from '@/components/product';
import { products } from '@/mocks';
import { useCartStore } from '@/stores';
import { useT } from '@/i18n';

export default function ProductDetail() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <View style={[styles.hero, { backgroundColor: colors.neutral }]}>
        <Image source={product.image} accessible accessibilityLabel={product.name} style={styles.heroImage} />
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={[styles.heroButton, { top: insets.top + space.sm, backgroundColor: colors.paper }]}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Pressable
          onPress={() => router.push('/(app)/shop/cart')}
          accessibilityRole="button"
          accessibilityLabel={t('shop_openCart')}
          style={[
            styles.heroButtonRightPosition,
            { top: insets.top + space.sm, backgroundColor: colors.paper },
          ]}
        >
          <BasketIcon />
          {cartItemCount > 0 ? (
            <View style={[styles.cartBadge, { backgroundColor: colors.marigold }]}>
              <Text style={[styles.cartBadgeLabel, { color: colors.pine }]}>{cartItemCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
      <ScreenScroll contentInsetBottom={100}>
        <Text style={[styles.name, { color: colors.ink }]}>{product.name}</Text>
        <Text style={[styles.unit, { color: colors.secondary }]}>{product.unit}</Text>
        <View style={styles.priceRow}>
          <PriceText amount={product.price} size="hero" />
          <Text style={[styles.perUnit, { color: colors.secondary }]}>/ {product.unit}</Text>
        </View>
        <Text style={[styles.yourPrice, { color: colors.muted }]}>{t('shop_yourPrice')}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.stockBadge, { backgroundColor: colors.tintRipe }]}>
            <View style={[styles.stockDot, { backgroundColor: colors.ripe }]} />
            <Text style={[styles.stockLabel, { color: colors.tintedGreenText }]}>{t('shop_inStock')}</Text>
          </View>
          <View style={[styles.deliveryBadge, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            <Text style={[styles.deliveryLabel, { color: colors.secondary }]}>{t('shop_nextDay')}</Text>
          </View>
        </View>
        <Text style={[styles.description, { color: colors.body }]}>
          Firm, ripe field produce sorted for consistency — ideal for prep in volume. Sourced from
          cooperatives around Musanze.
        </Text>
        <View style={[styles.quantityRow, { borderTopColor: colors.hairline }]}>
          <Text style={[styles.quantityLabel, { color: colors.ink }]}>{t('shop_quantity')}</Text>
          <QuantityStepper qty={qty} onInc={() => setQty((q) => q + 1)} onDec={() => setQty((q) => Math.max(1, q - 1))} />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <View style={styles.footerRow}>
          <View>
            <Text style={[styles.subtotalLabel, { color: colors.secondary }]}>{t('shop_subtotal')}</Text>
            <PriceText amount={product.price * qty} size="md" />
          </View>
          <Pressable
            onPress={onAddToCart}
            accessibilityRole="button"
            accessibilityLabel={t('shop_addToCart')}
            style={[styles.addButton, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.addLabel, { color: colors.paper }]}>{t('shop_addToCart')}</Text>
          </Pressable>
        </View>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { height: 220, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroButton: {
    position: 'absolute',
    left: space.md,
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonRightPosition: {
    position: 'absolute',
    right: space.md,
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeLabel: { ...text.micro },
  name: { ...text.h1, marginTop: space.md },
  unit: { ...text.caption, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm, marginTop: space.md },
  perUnit: { ...text.caption },
  yourPrice: { ...text.caption, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: space.sm, marginTop: space.md },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockLabel: { ...text.label },
  deliveryBadge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  deliveryLabel: { ...text.label },
  description: { ...text.body, marginTop: space.md, lineHeight: 20 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
  },
  quantityLabel: { ...text.bodySemi },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  subtotalLabel: { ...text.caption },
  addButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: { ...text.bodySemi },
});

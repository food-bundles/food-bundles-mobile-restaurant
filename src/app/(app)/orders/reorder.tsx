import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { PriceText } from '@/components/product';
import { useCartStore } from '@/stores';
import { orders, products } from '@/mocks';
import { useT } from '@/i18n';

export default function Reorder() {
  const t = useT();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useMemo(() => orders.find((o) => o.id === id) ?? orders[0], [id]);
  const add = useCartStore((state) => state.add);

  const reorderLines = order.lines.map((line) => ({
    line,
    product: products.find((p) => p.id === line.productId),
  }));
  const inStockCount = reorderLines.filter(({ product }) => product).length;

  const onAddAll = () => {
    reorderLines.forEach(({ line, product }) => {
      if (!product) return;
      for (let i = 0; i < line.qty; i += 1) add(line.productId);
    });
    router.push('/(app)/shop/cart');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader
        title={t('orders_reorderTitle')}
        subtitle={t('orders_reorderFrom', { orderId: order.id })}
      />
      <ScreenScroll contentInsetBottom={40}>
        {reorderLines.map(({ line, product }) => (
          <View key={line.productId} style={[styles.card, { backgroundColor: colors.paper }]}>
            {product ? (
              <Image
                source={product.image}
                accessible
                accessibilityLabel={product.name}
                style={[styles.image, { backgroundColor: colors.neutral }]}
              />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: colors.neutral }]} />
            )}
            <View style={styles.rowBottom}>
              <View style={styles.textCol}>
                <Text style={[styles.name, { color: colors.ink }]}>{line.name}</Text>
                {product ? (
                  <Text style={[styles.meta, { color: colors.secondary }]}>{line.unit}</Text>
                ) : (
                  <Text style={[styles.outOfStock, { color: colors.chili }]}>{t('orders_outOfStock')}</Text>
                )}
              </View>
              <PriceText amount={line.each * line.qty} size="lg" />
            </View>
          </View>
        ))}
      </ScreenScroll>
      <Pressable
        onPress={onAddAll}
        disabled={inStockCount === 0}
        accessibilityRole="button"
        accessibilityLabel={t('orders_addItemsToCart', { count: inStockCount })}
        style={[
          styles.addButton,
          { backgroundColor: colors.leaf },
          inStockCount === 0 && styles.addDisabled,
        ]}
      >
        <Text style={[styles.addLabel, { color: colors.paper }]}>{t('orders_addItemsToCart', { count: inStockCount })}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: space.md,
  },
  image: { width: '100%', height: 132 },
  imagePlaceholder: { opacity: 0.5 },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.md,
    padding: space.md,
  },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  meta: { ...text.caption, marginTop: 2 },
  outOfStock: { ...text.caption, marginTop: 2 },
  addButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: space.lg,
    marginBottom: space.lg,
  },
  addDisabled: { opacity: 0.5 },
  addLabel: { ...text.bodySemi },
});

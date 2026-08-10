import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { PriceText } from '@/components/product';
import { useCartStore } from '@/stores';
import { orders, products } from '@/mocks';
import { useT } from '@/i18n';

export default function Reorder() {
  const t = useT();
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
    <View style={styles.container}>
      <ScreenHeader
        title={t('orders_reorderTitle')}
        subtitle={t('orders_reorderFrom', { orderId: order.id })}
      />
      <ScreenScroll contentInsetBottom={40}>
        {reorderLines.map(({ line, product }) => (
          <View key={line.productId} style={styles.card}>
            {product ? (
              <Image source={product.image} accessible accessibilityLabel={product.name} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]} />
            )}
            <View style={styles.rowBottom}>
              <View style={styles.textCol}>
                <Text style={styles.name}>{line.name}</Text>
                {product ? (
                  <Text style={styles.meta}>{line.unit}</Text>
                ) : (
                  <Text style={styles.outOfStock}>{t('orders_outOfStock')}</Text>
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
        style={[styles.addButton, inStockCount === 0 && styles.addDisabled]}
      >
        <Text style={styles.addLabel}>{t('orders_addItemsToCart', { count: inStockCount })}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  card: {
    backgroundColor: color.paper,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: space.md,
  },
  image: { width: '100%', height: 132, backgroundColor: color.neutral },
  imagePlaceholder: { opacity: 0.5 },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.md,
    padding: space.md,
  },
  textCol: { flex: 1 },
  name: { ...text.bodySemi, color: color.ink },
  meta: { ...text.caption, color: color.secondary, marginTop: 2 },
  outOfStock: { ...text.caption, color: color.chili, marginTop: 2 },
  addButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: space.lg,
    marginBottom: space.lg,
  },
  addDisabled: { opacity: 0.5 },
  addLabel: { ...text.bodySemi, color: color.paper },
});

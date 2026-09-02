import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedScrollViewProps } from 'react-native-reanimated';
import { router } from 'expo-router';
import type { Product } from '@/mocks/types';
import { ProductCard } from '@/components/product';
import { useCartStore } from '@/stores';
import { space } from '@/theme';

export interface ProductGridProps {
  products: Product[];
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Set to false when the grid is nested inside another scroll container. */
  scrollEnabled?: boolean;
  /** Set to true when this grid is the screen's own scrollable region and should fill remaining space. */
  fill?: boolean;
  /** Reanimated scroll handler from useHideOnScroll, for screens where this grid is the primary scroll region. */
  onScroll?: AnimatedScrollViewProps['onScroll'];
}

export function ProductGrid({
  products,
  ListHeaderComponent,
  contentContainerStyle,
  scrollEnabled = true,
  fill = false,
  onScroll,
}: ProductGridProps) {
  const lines = useCartStore((state) => state.lines);
  const add = useCartStore((state) => state.add);
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);

  return (
    <Animated.FlatList<Product>
      data={products}
      keyExtractor={(product) => product.id}
      numColumns={2}
      style={fill ? styles.fill : undefined}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      onScroll={onScroll}
      scrollEventThrottle={16}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={({ item }) => {
        const line = lines.find((l) => l.productId === item.id);
        return (
          <View style={styles.cell}>
            <ProductCard
              product={item}
              onPress={() => router.push({ pathname: '/(app)/shop/product/[id]', params: { id: item.id } })}
              onAdd={() => add(item.id)}
              qty={line?.qty ?? 0}
              onInc={() => inc(item.id)}
              onDec={() => dec(item.id)}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { gap: space.md },
  row: { gap: space.md },
  cell: { flex: 1 },
});

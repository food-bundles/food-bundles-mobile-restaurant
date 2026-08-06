import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { Product } from '@/mocks/types';
import { ProductCard } from '@/components/product';
import { useCartStore } from '@/stores';
import { space } from '@/theme';

export interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const lines = useCartStore((state) => state.lines);
  const add = useCartStore((state) => state.add);
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);

  return (
    <FlatList
      data={products}
      keyExtractor={(product) => product.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      scrollEnabled={false}
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
  content: { gap: space.md },
  row: { gap: space.md },
  cell: { flex: 1 },
});

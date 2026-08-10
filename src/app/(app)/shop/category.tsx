import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { color, space, text } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { ProductGrid } from './_components/ProductGrid';
import { SortToggle, type SortOrder } from './_components/SortToggle';
import { products } from '@/mocks';
import { useT } from '@/i18n';
import type { ProductCategory } from '@/mocks/types';

const CATEGORY_TITLES: Record<ProductCategory, string> = {
  ANIMAL_PRODUCTS: 'Animal Products',
  FRESH_FRUITS: 'Fresh Fruits',
  FRESH_VEGETABLES: 'Fresh Vegetables',
  OTHERS: 'Others',
  DISCOUNTED: 'Discounted',
};

export default function Category() {
  const t = useT();
  const { category } = useLocalSearchParams<{ category?: ProductCategory }>();
  const [sort, setSort] = useState<SortOrder>('asc');

  const filtered = useMemo(
    () => (category ? products.filter((p) => p.category === category) : products),
    [category],
  );

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price)),
    [filtered, sort],
  );

  const title = category ? CATEGORY_TITLES[category] : 'All produce';

  return (
    <View style={styles.container}>
      <ScreenHeader title={title} />
      <ScreenScroll contentInsetBottom={40}>
        <View style={styles.metaRow}>
          <Text style={styles.count}>{t('shop_productsCount', { count: sorted.length })}</Text>
          <SortToggle sort={sort} onToggle={() => setSort((s) => (s === 'asc' ? 'desc' : 'asc'))} />
        </View>
        <View style={styles.gridGap}>
          <ProductGrid products={sorted} />
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.md,
  },
  count: { ...text.caption, color: color.secondary },
  gridGap: { marginTop: space.md },
});

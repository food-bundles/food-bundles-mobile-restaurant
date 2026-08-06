import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
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
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.md,
  },
  count: { ...text.caption, color: color.secondary },
  gridGap: { marginTop: space.md },
});

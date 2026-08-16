import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { SearchField } from './_components/SearchField';
import { ProductGrid } from './_components/ProductGrid';
import { products } from '@/mocks';
import { useT } from '@/i18n';

const RECENT_SEARCHES = ['Onions', 'Eggs', 'Cabbage'];

export default function Search() {
  const t = useT();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return products.filter((product) => product.name.toLowerCase().includes(lower));
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + space.sm }]}>
        <SearchField value={query} onChangeText={setQuery} placeholder={t('shop_searchProduce')} />
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('shop_cancel')}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelLabel}>{t('shop_cancel')}</Text>
        </Pressable>
      </View>
      <ScreenScroll contentInsetBottom={40}>
        {query.trim() ? (
          <>
            <Text style={styles.sectionLabel}>{t('shop_results')}</Text>
            <View style={styles.gridGap}>
              <ProductGrid products={results} scrollEnabled={false} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>{t('shop_recent')}</Text>
            <View style={styles.chips}>
              {RECENT_SEARCHES.map((term) => (
                <Pressable
                  key={term}
                  onPress={() => setQuery(term)}
                  accessibilityRole="button"
                  accessibilityLabel={term}
                  style={styles.chip}
                >
                  <Text style={styles.chipLabel}>{term}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  cancelButton: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  cancelLabel: { ...text.label, color: color.leaf },
  sectionLabel: { ...text.overline, color: color.secondary, marginTop: space.md },
  gridGap: { marginTop: space.sm },
  chips: { flexDirection: 'row', gap: space.sm, marginTop: space.sm, flexWrap: 'wrap' },
  chip: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { ...text.label, color: color.secondary },
});

import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { SearchField } from './_components/SearchField';
import { ProductGrid } from './_components/ProductGrid';
import { products } from '@/mocks';
import { useT } from '@/i18n';

const RECENT_SEARCHES = ['Onions', 'Eggs', 'Cabbage'];

export default function Search() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return products.filter((product) => product.name.toLowerCase().includes(lower));
  }, [query]);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <View style={[styles.header, { paddingTop: insets.top + space.sm, borderBottomColor: colors.hairline }]}>
        <SearchField value={query} onChangeText={setQuery} placeholder={t('shop_searchProduce')} />
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('shop_cancel')}
          style={styles.cancelButton}
        >
          <Text style={[styles.cancelLabel, { color: colors.leaf }]}>{t('shop_cancel')}</Text>
        </Pressable>
      </View>
      <ScreenScroll contentInsetBottom={40}>
        {query.trim() ? (
          <>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('shop_results')}</Text>
            <View style={styles.gridGap}>
              <ProductGrid products={results} scrollEnabled={false} />
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('shop_recent')}</Text>
            <View style={styles.chips}>
              {RECENT_SEARCHES.map((term) => (
                <Pressable
                  key={term}
                  onPress={() => setQuery(term)}
                  accessibilityRole="button"
                  accessibilityLabel={term}
                  style={[styles.chip, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
                >
                  <Text style={[styles.chipLabel, { color: colors.secondary }]}>{term}</Text>
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
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
  },
  cancelButton: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  cancelLabel: { ...text.label },
  sectionLabel: { ...text.overline, marginTop: space.md },
  gridGap: { marginTop: space.sm },
  chips: { flexDirection: 'row', gap: space.sm, marginTop: space.sm, flexWrap: 'wrap' },
  chip: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: { ...text.label },
});

import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { SectionHeader } from '@/components/layout';
import { CategoryChips, type CategoryOption } from '@/app/(public)/_components/CategoryChips';
import { ShopHomeHeader } from '../shop/_components/ShopHomeHeader';
import { SearchTrigger } from '../shop/_components/SearchTrigger';
import { HeroCarousel } from '../shop/_components/HeroCarousel';
import { ProductGrid } from '../shop/_components/ProductGrid';
import { SeeAllLink } from '../shop/_components/SeeAllLink';
import { products } from '@/mocks';
import { useT } from '@/i18n';
import { space, useTheme } from '@/theme';

const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: 'ALL', label: 'All' },
  { key: 'FRESH_VEGETABLES', label: 'Roots' },
  { key: 'FRESH_FRUITS', label: 'Veg' },
  { key: 'ANIMAL_PRODUCTS', label: 'Leafy' },
];

export default function ShopHome() {
  const t = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <View style={[styles.stickyHeader, { backgroundColor: colors.oat, paddingTop: insets.top }]}>
        <ShopHomeHeader />
        <View style={styles.searchGap}>
          <SearchTrigger />
        </View>
        <View style={styles.carouselGap}>
          <HeroCarousel />
        </View>
        <View style={styles.chipsGap}>
          <CategoryChips
            options={CATEGORY_OPTIONS}
            selected="ALL"
            onSelect={(key) =>
              router.push(
                key === 'ALL'
                  ? '/(app)/shop/category'
                  : { pathname: '/(app)/shop/category', params: { category: key } },
              )
            }
          />
        </View>
      </View>
      <ProductGrid
        products={products.slice(0, 4)}
        fill
        contentContainerStyle={[styles.gridContent, { paddingBottom: tabBarHeight + space.xxl }]}
        ListHeaderComponent={
          <View style={styles.sectionGap}>
            <SectionHeader title={t('shop_popularWeek')} action={<SeeAllLink />} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stickyHeader: {},
  searchGap: { marginTop: space.md, paddingHorizontal: space.lg },
  carouselGap: { marginTop: space.md },
  chipsGap: { marginTop: space.md, paddingHorizontal: space.lg, paddingBottom: space.sm },
  sectionGap: { paddingBottom: space.sm },
  gridContent: { paddingHorizontal: space.lg },
});

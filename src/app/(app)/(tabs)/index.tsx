import { useRef, useState } from 'react';
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { SectionHeader } from '@/components/layout';
import { Toast } from '@/components/primitives';
import { CategoryChips, type CategoryOption } from '@/app/(public)/_components/CategoryChips';
import { ShopHomeHeader } from '../shop/_components/ShopHomeHeader';
import { SearchTrigger } from '../shop/_components/SearchTrigger';
import { HeroCarousel } from '../shop/_components/HeroCarousel';
import { ProductGrid } from '../shop/_components/ProductGrid';
import { SeeAllLink } from '../shop/_components/SeeAllLink';
import { products } from '@/mocks';
import { useT } from '@/i18n';
import { hit, space, text, useTheme } from '@/theme';
import { useHideOnScroll } from '@/hooks';

const EXIT_CONFIRM_WINDOW_MS = 2000;

/** Android-only: first hardware back-press on this root screen shows a toast instead of exiting; a second press within the window lets it through. */
function useExitConfirm(message: string): { toastMessage: string | null; hideToast: () => void } {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const armedRef = useRef(false);

  useFocusEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (armedRef.current) return false;
      armedRef.current = true;
      setToastMessage(message);
      setTimeout(() => {
        armedRef.current = false;
      }, EXIT_CONFIRM_WINDOW_MS);
      return true;
    });

    return () => subscription.remove();
  });

  return { toastMessage, hideToast: () => setToastMessage(null) };
}

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
  const { toastMessage, hideToast } = useExitConfirm(t('common_pressBackToExit'));
  const { onScroll } = useHideOnScroll();

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <Toast message={toastMessage} onHide={hideToast} />
      <View style={[styles.stickyHeader, { backgroundColor: colors.oat, paddingTop: insets.top }]}>
        <ShopHomeHeader />
        <View style={styles.searchGap}>
          <SearchTrigger />
        </View>
        <View style={styles.carouselGap}>
          <HeroCarousel />
        </View>
        <Pressable
          onPress={() => router.push('/(app)/market/menu-generator')}
          accessibilityRole="button"
          accessibilityLabel={t('menu_generatorShortcut')}
          style={styles.menuGeneratorHit}
        >
          <Text style={[styles.menuGeneratorLabel, { color: colors.leaf }]}>{t('menu_generatorShortcut')} →</Text>
        </Pressable>
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
        onScroll={onScroll}
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
  menuGeneratorHit: {
    minHeight: hit.min,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  menuGeneratorLabel: { ...text.label },
  chipsGap: { marginTop: space.md, paddingHorizontal: space.lg, paddingBottom: space.sm },
  sectionGap: { paddingBottom: space.sm },
  gridContent: { paddingHorizontal: space.lg },
});

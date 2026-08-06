import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { PersonIcon, ChevronLeftIcon, BasketIcon } from '@/components/icons';
import { CategoryChips, type CategoryOption } from '../_components/CategoryChips';
import { GuestProductGrid } from '../_components/GuestProductGrid';
import { useGuestCartStore } from '@/stores';
import { products } from '@/mocks';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';

const CATEGORY_OPTIONS: CategoryOption[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ANIMAL_PRODUCTS', label: 'Animal Products' },
  { key: 'FRESH_FRUITS', label: 'Fresh Fruits' },
  { key: 'FRESH_VEGETABLES', label: 'Fresh Vegetables' },
  { key: 'OTHERS', label: 'Others' },
  { key: 'DISCOUNTED', label: 'Discounted' },
];

export default function GuestShop() {
  const t = useT();
  const [category, setCategory] = useState<CategoryOption['key']>('ALL');
  const itemCount = useGuestCartStore((state) => state.itemCount());
  const total = useGuestCartStore((state) => state.total());

  const visibleProducts = useMemo(
    () => (category === 'ALL' ? products : products.filter((p) => p.category === category)),
    [category],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.iconButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('guest_shopTitle')}</Text>
        <Pressable
          onPress={() => router.push('/(public)/guest/cart')}
          accessibilityRole="button"
          accessibilityLabel={`Open guest basket, ${itemCount} items`}
          style={styles.iconButton}
        >
          <BasketIcon />
          {itemCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>{itemCount}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel={t('landing_login')}
          style={styles.iconButtonTint}
        >
          <PersonIcon color={color.pine} />
        </Pressable>
      </View>
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            <Text style={styles.bannerBold}>{t('guest_bannerTitle')}</Text> — {t('guest_bannerBody')}
          </Text>
        </View>
        <View style={styles.chips}>
          <CategoryChips options={CATEGORY_OPTIONS} selected={category} onSelect={setCategory} />
        </View>
        <View style={styles.grid}>
          <GuestProductGrid products={visibleProducts} onSelectProduct={() => undefined} />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.footerCount}>{itemCount} items</Text>
            <Text style={styles.footerTotal}>{formatRwf(total)}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/(public)/guest/cart')}
            accessibilityRole="button"
            accessibilityLabel={t('guest_viewBasket')}
            style={styles.footerButton}
          >
            <Text style={styles.footerButtonLabel}>{t('guest_viewBasket')}</Text>
          </Pressable>
        </View>
      </StickyFooter>
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
  title: { ...text.h2, color: color.ink, flex: 1 },
  iconButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonTint: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: color.marigold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeLabel: { ...text.micro, color: color.pine },
  banner: {
    backgroundColor: color.tintMarigoldSoft,
    borderWidth: 1,
    borderColor: color.marigoldLine,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  bannerText: { ...text.caption, color: color.tintedAmberText, lineHeight: 18 },
  bannerBold: { ...text.bodySemi, color: color.tintedAmberText },
  chips: { marginTop: space.md },
  grid: { marginTop: space.md },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  footerCount: { ...text.caption, color: color.secondary },
  footerTotal: { ...text.h2, color: color.ink, fontVariant: ['tabular-nums'] },
  footerButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonLabel: { ...text.bodySemi, color: color.paper },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon, BasketIcon } from '@/components/icons';
import { EmptyState } from '@/components/primitives';
import { CartList } from './_components/CartList';
import { CartTotalsCard } from './_components/CartTotalsCard';
import { useCartStore } from '@/stores';
import { account } from '@/mocks';
import { useT } from '@/i18n';

export default function Cart() {
  const t = useT();
  const itemCount = useCartStore((state) => state.itemCount());

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
        <View>
          <Text style={styles.title}>{t('shop_cart')}</Text>
          <Text style={styles.subtitle}>
            {account.businessName} · {t('shop_tapToEdit')}
          </Text>
        </View>
      </View>
      <ScreenScroll contentInsetBottom={80}>
        {itemCount === 0 ? (
          <EmptyState
            icon={<BasketIcon size={22} color={color.leaf} />}
            title={t('shop_emptyCartTitle')}
            message={t('shop_emptyCartMessage')}
          />
        ) : (
          <>
            <CartList />
            <View style={styles.totalsGap}>
              <CartTotalsCard />
            </View>
          </>
        )}
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push('/(app)/checkout/delivery')}
          disabled={itemCount === 0}
          accessibilityRole="button"
          accessibilityLabel={t('shop_checkout')}
          style={[styles.checkoutButton, itemCount === 0 && styles.checkoutDisabled]}
        >
          <Text style={styles.checkoutLabel}>{t('shop_checkout')}</Text>
        </Pressable>
      </StickyFooter>
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
  subtitle: { ...text.caption, color: color.secondary },
  totalsGap: { marginTop: space.md },
  checkoutButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutDisabled: { opacity: 0.5 },
  checkoutLabel: { ...text.bodySemi, color: color.paper },
});

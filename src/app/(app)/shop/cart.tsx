import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { BasketIcon } from '@/components/icons';
import { EmptyState } from '@/components/primitives';
import { CartList } from './_components/CartList';
import { CartTotalsCard } from './_components/CartTotalsCard';
import { useCartStore } from '@/stores';
import { account } from '@/mocks';
import { useT } from '@/i18n';

export default function Cart() {
  const t = useT();
  const { colors } = useTheme();
  const itemCount = useCartStore((state) => state.itemCount());

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('shop_cart')} subtitle={`${account.businessName} · ${t('shop_tapToEdit')}`} />
      <ScreenScroll contentInsetBottom={80}>
        {itemCount === 0 ? (
          <EmptyState
            icon={<BasketIcon size={22} color={colors.leaf} />}
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
          style={[
            styles.checkoutButton,
            { backgroundColor: colors.leaf },
            itemCount === 0 && styles.checkoutDisabled,
          ]}
        >
          <Text style={[styles.checkoutLabel, { color: colors.paper }]}>{t('shop_checkout')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  totalsGap: { marginTop: space.md },
  checkoutButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutDisabled: { opacity: 0.5 },
  checkoutLabel: { ...text.bodySemi },
});

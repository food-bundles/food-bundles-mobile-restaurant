import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { account } from '@/mocks';
import { useCartStore, useNotificationsStore, useSessionStore } from '@/stores';
import { BellIcon, BasketIcon } from '@/components/icons';

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function ShopHomeHeader() {
  const t = useT();
  const { colors } = useTheme();
  const itemCount = useCartStore((state) => state.itemCount());
  const unreadCount = useNotificationsStore((state) => state.unreadCount());
  const restaurantImageUri = useSessionStore((state) => state.restaurantImageUri);

  return (
    <View style={styles.row}>
      <View style={styles.venueRow}>
        {restaurantImageUri ? (
          <Image
            source={{ uri: restaurantImageUri }}
            accessible={false}
            style={[styles.venueLogo, { backgroundColor: colors.tintLeaf }]}
          />
        ) : (
          <View style={[styles.venueLogo, { backgroundColor: colors.tintLeaf }]}>
            <Text style={[styles.venueInitials, { color: colors.leaf }]}>{initialsOf(account.businessName)}</Text>
          </View>
        )}
        <View>
          <Text style={[styles.orderingFor, { color: colors.secondary }]}>{t('shop_orderingFor')}</Text>
          <Text style={[styles.venueName, { color: colors.ink }]}>{account.businessName}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/(app)/notifications')}
          accessibilityRole="button"
          accessibilityLabel={t('shop_notifications', { count: unreadCount })}
          style={[styles.iconButton, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
        >
          <BellIcon />
          {unreadCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: colors.chili }]}>
              <Text style={[styles.badgeLabel, { color: colors.paper }]}>{unreadCount}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          onPress={() => router.push('/(app)/shop/cart')}
          accessibilityRole="button"
          accessibilityLabel={t('shop_openCart')}
          style={[styles.iconButton, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
        >
          <BasketIcon />
          {itemCount > 0 ? (
            <View style={[styles.cartBadge, { backgroundColor: colors.marigold }]}>
              <Text style={[styles.cartBadgeLabel, { color: colors.pine }]}>{itemCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
  },
  venueRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  venueLogo: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  venueInitials: { ...text.label },
  orderingFor: { ...text.caption },
  venueName: { ...text.h2 },
  actions: { flexDirection: 'row', gap: space.sm },
  iconButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: { ...text.micro, fontSize: 10 },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeLabel: { ...text.micro },
});

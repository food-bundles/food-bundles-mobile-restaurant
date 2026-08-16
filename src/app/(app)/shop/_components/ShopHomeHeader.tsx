import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
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
  const itemCount = useCartStore((state) => state.itemCount());
  const unreadCount = useNotificationsStore((state) => state.unreadCount());
  const restaurantImageUri = useSessionStore((state) => state.restaurantImageUri);

  return (
    <View style={styles.row}>
      <View style={styles.venueRow}>
        {restaurantImageUri ? (
          <Image source={{ uri: restaurantImageUri }} accessible={false} style={styles.venueLogo} />
        ) : (
          <View style={styles.venueLogo}>
            <Text style={styles.venueInitials}>{initialsOf(account.businessName)}</Text>
          </View>
        )}
        <View>
          <Text style={styles.orderingFor}>{t('shop_orderingFor')}</Text>
          <Text style={styles.venueName}>{account.businessName}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/(app)/notifications')}
          accessibilityRole="button"
          accessibilityLabel={t('shop_notifications', { count: unreadCount })}
          style={styles.iconButton}
        >
          <BellIcon />
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>{unreadCount}</Text>
            </View>
          ) : null}
        </Pressable>
        <Pressable
          onPress={() => router.push('/(app)/shop/cart')}
          accessibilityRole="button"
          accessibilityLabel={t('shop_openCart')}
          style={styles.iconButton}
        >
          <BasketIcon />
          {itemCount > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeLabel}>{itemCount}</Text>
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
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  venueInitials: { ...text.label, color: color.leaf },
  orderingFor: { ...text.caption, color: color.secondary },
  venueName: { ...text.h2, color: color.ink },
  actions: { flexDirection: 'row', gap: space.sm },
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: color.chili,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: { ...text.micro, color: color.paper, fontSize: 10 },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: color.marigold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeLabel: { ...text.micro, color: color.pine },
});

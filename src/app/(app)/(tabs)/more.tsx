import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { MoreMenuRow } from './_components/MoreMenuRow';
import { PersonIcon, HelpIcon, WalletIcon, BellIcon, TrendingUpIcon, SendIcon } from '@/components/icons';
import { useT } from '@/i18n';
import { useNotificationsStore, useSessionStore, useChatStore } from '@/stores';
import { account, plans } from '@/mocks';

export default function More() {
  const t = useT();
  const { colors } = useTheme();
  const tier = useSessionStore((state) => state.tier);
  const restaurantImageUri = useSessionStore((state) => state.restaurantImageUri);
  const unreadCount = useNotificationsStore((state) => state.unreadCount());
  const unreadMessages = useChatStore((state) =>
    state.conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
  );
  const planLabel = plans.find((p) => p.id === tier)?.name ?? t('sub_noPlan');

  const initials = account.managerName
    .split(' ')
    .map((part) => part[0])
    .join('');

  return (
    <ScreenScroll>
      <Text style={[styles.title, { color: colors.ink }]}>{t('more_title')}</Text>
      <View style={[styles.profileCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
        {restaurantImageUri ? (
          <Image source={{ uri: restaurantImageUri }} accessible={false} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.tintLeaf }]}>
            <Text style={[styles.avatarLabel, { color: colors.pine }]}>{initials}</Text>
          </View>
        )}
        <View style={styles.profileText}>
          <Text style={[styles.name, { color: colors.ink }]}>{account.managerName}</Text>
          <Text style={[styles.role, { color: colors.secondary }]}>
            {t('more_managerLabel', { business: account.businessName })}
          </Text>
        </View>
      </View>
      <View style={[styles.group, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
        <MoreMenuRow
          icon={<WalletIcon size={18} color={colors.leaf} />}
          label={t('more_subscription')}
          trailing={<Text style={[styles.trailing, { color: colors.secondary }]}>{planLabel}</Text>}
          onPress={() => router.push('/(app)/subscription/current')}
        />
        <MoreMenuRow
          icon={<PersonIcon size={18} color={colors.leaf} />}
          label={t('more_affiliators')}
          trailing={<Text style={[styles.trailing, { color: colors.secondary }]}>3</Text>}
          onPress={() => router.push('/(app)/affiliators')}
        />
        <MoreMenuRow
          icon={<BellIcon size={18} color={colors.leaf} />}
          label={t('more_notifications')}
          trailing={unreadCount > 0 ? <View style={[styles.dot, { backgroundColor: colors.marigold }]} /> : null}
          onPress={() => router.push('/(app)/notifications')}
        />
        <MoreMenuRow
          icon={<SendIcon size={18} color={colors.leaf} />}
          label={t('msg_entryLabel')}
          trailing={unreadMessages > 0 ? <View style={[styles.dot, { backgroundColor: colors.marigold }]} /> : null}
          onPress={() => router.push('/(app)/messages')}
        />
        <MoreMenuRow
          icon={<TrendingUpIcon size={18} color={colors.leaf} />}
          label={t('more_marketPrices')}
          onPress={() => router.push('/(app)/market/market-prices')}
          isLast
        />
      </View>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('more_analytics')}</Text>
      <View style={[styles.group, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
        <MoreMenuRow
          icon={<TrendingUpIcon size={18} color={colors.leaf} />}
          label={t('more_marketStanding')}
          onPress={() => router.push('/(app)/market/restaurant-ranking')}
          isLast
        />
      </View>
      <View style={[styles.group, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
        <MoreMenuRow
          icon={<PersonIcon size={18} color={colors.body} />}
          label={t('more_accountSettings')}
          onPress={() => router.push('/(app)/settings/account')}
        />
        <MoreMenuRow
          icon={<HelpIcon size={18} color={colors.body} />}
          label={t('more_help')}
          onPress={() => router.push('/(app)/settings/help')}
          isLast
        />
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h1 },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: { ...text.h2 },
  profileText: { flex: 1 },
  name: { ...text.h2 },
  role: { ...text.caption, marginTop: 2 },
  group: {
    borderWidth: 1,
    borderRadius: radius.lg,
    marginTop: space.md,
    overflow: 'hidden',
  },
  trailing: { ...text.caption },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

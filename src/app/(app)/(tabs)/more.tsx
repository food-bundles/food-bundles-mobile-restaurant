import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { MoreMenuRow } from './_components/MoreMenuRow';
import { PersonIcon, HelpIcon, WalletIcon, BellIcon } from '@/components/icons';
import { useT } from '@/i18n';
import { useNotificationsStore, useSessionStore } from '@/stores';
import { account, plans } from '@/mocks';

export default function More() {
  const t = useT();
  const tier = useSessionStore((state) => state.tier);
  const unreadCount = useNotificationsStore((state) => state.unreadCount());
  const planLabel = plans.find((p) => p.id === tier)?.name ?? t('sub_noPlan');

  const initials = account.managerName
    .split(' ')
    .map((part) => part[0])
    .join('');

  return (
    <ScreenScroll>
      <Text style={styles.title}>{t('more_title')}</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>{initials}</Text>
        </View>
        <View style={styles.profileText}>
          <Text style={styles.name}>{account.managerName}</Text>
          <Text style={styles.role}>{t('more_managerLabel', { business: account.businessName })}</Text>
        </View>
      </View>
      <View style={styles.group}>
        <MoreMenuRow
          icon={<WalletIcon size={18} color={color.leaf} />}
          label={t('more_subscription')}
          trailing={<Text style={styles.trailing}>{planLabel}</Text>}
          onPress={() => router.push('/(app)/subscription/current')}
        />
        <MoreMenuRow
          icon={<PersonIcon size={18} color={color.leaf} />}
          label={t('more_affiliators')}
          trailing={<Text style={styles.trailing}>3</Text>}
          onPress={() => router.push('/(app)/affiliators')}
        />
        <MoreMenuRow
          icon={<BellIcon size={18} color={color.leaf} />}
          label={t('more_notifications')}
          trailing={unreadCount > 0 ? <View style={styles.dot} /> : null}
          onPress={() => router.push('/(app)/notifications')}
          isLast
        />
      </View>
      <View style={styles.group}>
        <MoreMenuRow
          icon={<PersonIcon size={18} color={color.body} />}
          label={t('more_accountSettings')}
          onPress={() => router.push('/(app)/settings/account')}
        />
        <MoreMenuRow
          icon={<HelpIcon size={18} color={color.body} />}
          label={t('more_help')}
          onPress={() => router.push('/(app)/settings/help')}
          isLast
        />
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h1, color: color.ink },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: { ...text.h2, color: color.pine },
  profileText: { flex: 1 },
  name: { ...text.h2, color: color.ink },
  role: { ...text.caption, color: color.secondary, marginTop: 2 },
  group: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    marginTop: space.md,
    overflow: 'hidden',
  },
  trailing: { ...text.caption, color: color.secondary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.marigold },
});

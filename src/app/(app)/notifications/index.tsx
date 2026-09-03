import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { BellIcon, CheckIcon } from '@/components/icons';
import { EmptyState } from '@/components/primitives';
import { NotificationRow } from './_components/NotificationRow';
import { NotificationFilterChips, type NotificationFilter } from './_components/NotificationFilterChips';
import { groupNotificationsByDay, type NotificationGroupKey } from './_components/notificationGrouping';
import { useNotificationsStore } from '@/stores';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const GROUP_LABEL_KEY: Record<NotificationGroupKey, TranslationKey> = {
  today: 'notif_groupToday',
  yesterday: 'notif_groupYesterday',
  earlierThisWeek: 'notif_groupEarlierWeek',
  older: 'notif_groupOlder',
};

const FILTER_LABEL_KEY: Record<NotificationFilter, TranslationKey> = {
  all: 'notif_filterAll',
  order: 'notif_filterOrders',
  wallet: 'notif_filterWallet',
  voucher: 'notif_filterVouchers',
  marketPrice: 'notif_filterMarket',
  priceAlert: 'notif_filterAlerts',
  consent: 'notif_filterAlerts',
  repayment: 'notif_filterAlerts',
  system: 'notif_filterSystem',
};

const FILTER_ORDER: NotificationFilter[] = ['all', 'order', 'wallet', 'voucher', 'marketPrice', 'priceAlert', 'system'];

/** Notification centre: channel-filtered, day-grouped list with swipe-to-delete and mark-all-read. */
export default function NotificationsList() {
  const t = useT();
  const { colors } = useTheme();
  const notifications = useNotificationsStore((state) => state.notifications);
  const unreadCount = useNotificationsStore((state) => state.unreadCount());
  const markRead = useNotificationsStore((state) => state.markRead);
  const markAllRead = useNotificationsStore((state) => state.markAllRead);
  const deleteNotification = useNotificationsStore((state) => state.deleteNotification);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.channel === filter);
  const groups = groupNotificationsByDay(filtered);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader
        title={t('notif_title')}
        trailing={
          unreadCount > 0 ? (
            <Pressable
              onPress={markAllRead}
              accessibilityRole="button"
              accessibilityLabel={t('notif_markAllRead')}
              style={styles.markAllButton}
            >
              <Text style={[styles.markAllLabel, { color: colors.leaf }]}>{t('notif_markAllRead')}</Text>
            </Pressable>
          ) : null
        }
      />
      <View style={styles.filterGap}>
        <NotificationFilterChips
          options={FILTER_ORDER.map((key) => ({ key, label: t(FILTER_LABEL_KEY[key]) }))}
          active={filter}
          onSelect={setFilter}
        />
      </View>
      <ScreenScroll contentInsetBottom={40}>
        {filtered.length === 0 ? (
          filter === 'all' ? (
            <EmptyState
              icon={<CheckIcon size={22} color={colors.leaf} />}
              title={t('notif_allCaughtUp')}
              message={t('notif_emptyMessage')}
            />
          ) : (
            <EmptyState
              icon={<BellIcon size={22} color={colors.leaf} />}
              title={t('notif_channelEmpty', { channel: t(FILTER_LABEL_KEY[filter]) })}
              message={t('notif_emptyMessage')}
            />
          )
        ) : (
          groups.map((group) => (
            <View key={group.key} style={styles.groupGap}>
              <Text style={[styles.groupLabel, { color: colors.secondary }]}>{t(GROUP_LABEL_KEY[group.key])}</Text>
              {group.items.map((item) => (
                <NotificationRow
                  key={item.id}
                  notification={item}
                  onPress={() => markRead(item.id)}
                  onDelete={() => deleteNotification(item.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  markAllButton: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  markAllLabel: { ...text.label },
  filterGap: { marginTop: space.sm, paddingHorizontal: space.lg },
  groupGap: { marginBottom: space.md },
  groupLabel: { ...text.overline, marginBottom: space.sm },
});

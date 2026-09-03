import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { SwipeRow } from '@/components/layout';
import { renderChannelIcon } from '@/components/notifications/channelIcon';
import { computeRelativeTime } from '@/lib';
import { useT } from '@/i18n';
import type { AppNotification } from '@/mocks/types';

export interface NotificationRowProps {
  notification: AppNotification;
  onPress: () => void;
  onDelete: () => void;
}

function useRelativeTimeLabel(iso: string): string {
  const t = useT();
  const result = computeRelativeTime(iso);
  switch (result.kind) {
    case 'justNow':
      return t('notif_justNow');
    case 'minutesAgo':
      return t('notif_minutesAgo', { minutes: result.minutes });
    case 'hoursAgo':
      return t('notif_hoursAgo', { hours: result.hours });
    case 'yesterday':
      return t('notif_yesterdayAt', { time: result.time });
    case 'daysAgo':
      return t('notif_daysAgo', { days: result.days });
  }
}

/** One notification-centre row: image or channel icon, title/body, relative time, and swipe-to-delete. */
export function NotificationRow({ notification, onPress, onDelete }: NotificationRowProps) {
  const t = useT();
  const { colors } = useTheme();
  const timeLabel = useRelativeTimeLabel(notification.timestamp);
  const readLabel = notification.read ? t('notif_readLabel') : t('notif_unreadLabel');

  const onRowPress = () => {
    onPress();
    if (notification.deepLink) router.push(notification.deepLink as Href);
  };

  return (
    <SwipeRow onDelete={onDelete} deleteLabel={t('notif_delete')}>
      <Pressable
        onPress={onRowPress}
        accessibilityRole="button"
        accessibilityLabel={`${notification.title}, ${readLabel}`}
        style={[styles.row, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
      >
        {notification.imageUri ? (
          <Image source={{ uri: notification.imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]}>
            {renderChannelIcon(notification.channel, colors.leaf)}
          </View>
        )}
        <View style={styles.textCol}>
          <Text style={[styles.title, { color: notification.read ? colors.secondary : colors.ink }]}>
            {notification.title}
          </Text>
          <Text style={[styles.body, { color: colors.secondary }]} numberOfLines={2}>
            {notification.body}
          </Text>
          <Text style={[styles.time, { color: colors.muted }]}>{timeLabel}</Text>
        </View>
        {!notification.read ? <View style={[styles.dot, { backgroundColor: colors.marigold }]} /> : null}
      </Pressable>
    </SwipeRow>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
  },
  image: { width: 48, height: 48, borderRadius: radius.sm + 2 },
  iconWrap: { width: 48, height: 48, borderRadius: radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
  textCol: { flex: 1 },
  title: { ...text.bodySemi },
  body: { ...text.caption, marginTop: 2 },
  time: { ...text.micro, marginTop: space.xs },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});

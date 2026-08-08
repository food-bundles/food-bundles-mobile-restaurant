import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { BellIcon } from '@/components/icons';
import { formatDate } from '@/lib';
import { useT } from '@/i18n';
import type { NotificationItem } from '@/mocks/types';

export interface NotificationRowProps {
  notification: NotificationItem;
  onPress: () => void;
}

export function NotificationRow({ notification, onPress }: NotificationRowProps) {
  const t = useT();
  const readLabel = notification.read ? t('notif_readLabel') : t('notif_unreadLabel');

  return (
    <Pressable
      onPress={() => {
        onPress();
        if (notification.orderId) {
          router.push({ pathname: '/(app)/notifications/[orderId]', params: { orderId: notification.orderId } });
        }
      }}
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}, ${readLabel}`}
      style={styles.row}
    >
      <View style={[styles.iconWrap, !notification.read && styles.iconWrapUnread]}>
        <BellIcon size={18} color={notification.read ? color.secondary : color.leaf} />
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, !notification.read && styles.titleUnread]}>{notification.title}</Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.date}>{formatDate(notification.date)}</Text>
      </View>
      {!notification.read ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm + 1,
    backgroundColor: color.neutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: { backgroundColor: color.tintLeaf },
  textCol: { flex: 1 },
  title: { ...text.bodySemi, color: color.secondary },
  titleUnread: { color: color.ink },
  body: { ...text.caption, color: color.secondary, marginTop: 2 },
  date: { ...text.micro, color: color.muted, marginTop: space.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.marigold, marginTop: 4 },
});

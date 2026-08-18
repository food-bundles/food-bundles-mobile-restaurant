import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
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
  const { colors } = useTheme();
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
      style={[styles.row, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: notification.read ? colors.neutral : colors.tintLeaf },
        ]}
      >
        <BellIcon size={18} color={notification.read ? colors.secondary : colors.leaf} />
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: notification.read ? colors.secondary : colors.ink }]}>
          {notification.title}
        </Text>
        <Text style={[styles.body, { color: colors.secondary }]} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={[styles.date, { color: colors.muted }]}>{formatDate(notification.date)}</Text>
      </View>
      {!notification.read ? <View style={[styles.dot, { backgroundColor: colors.marigold }]} /> : null}
    </Pressable>
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
    marginBottom: space.sm,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm + 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  title: { ...text.bodySemi },
  body: { ...text.caption, marginTop: 2 },
  date: { ...text.micro, marginTop: space.xs },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});

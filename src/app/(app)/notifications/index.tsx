import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon, BellIcon } from '@/components/icons';
import { EmptyState } from '@/components/primitives';
import { NotificationRow } from './_components/NotificationRow';
import { useNotificationsStore } from '@/stores';
import { useT } from '@/i18n';

export default function NotificationsList() {
  const t = useT();
  const items = useNotificationsStore((state) => state.items);
  const fetch = useNotificationsStore((state) => state.fetch);
  const markRead = useNotificationsStore((state) => state.markRead);

  useEffect(() => {
    if (items.length === 0) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAllRead = () => {
    items.forEach((item) => markRead(item.id));
  };

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
        <Text style={styles.title}>{t('notif_title')}</Text>
        <Pressable
          onPress={markAllRead}
          accessibilityRole="button"
          accessibilityLabel={t('notif_markAllRead')}
          style={styles.markAllButton}
        >
          <Text style={styles.markAllLabel}>{t('notif_markAllRead')}</Text>
        </Pressable>
      </View>
      <ScreenScroll contentInsetBottom={40}>
        {items.length === 0 ? (
          <EmptyState
            icon={<BellIcon size={22} color={color.leaf} />}
            title={t('notif_emptyTitle')}
            message={t('notif_emptyMessage')}
          />
        ) : (
          items.map((item) => (
            <NotificationRow key={item.id} notification={item} onPress={() => markRead(item.id)} />
          ))
        )}
      </ScreenScroll>
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
  title: { ...text.h2, color: color.ink, flex: 1 },
  markAllButton: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  markAllLabel: { ...text.label, color: color.leaf },
});

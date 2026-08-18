import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { BellIcon } from '@/components/icons';
import { EmptyState } from '@/components/primitives';
import { NotificationRow } from './_components/NotificationRow';
import { useNotificationsStore } from '@/stores';
import { useT } from '@/i18n';

export default function NotificationsList() {
  const t = useT();
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader
        title={t('notif_title')}
        trailing={
          <Pressable
            onPress={markAllRead}
            accessibilityRole="button"
            accessibilityLabel={t('notif_markAllRead')}
            style={styles.markAllButton}
          >
            <Text style={[styles.markAllLabel, { color: colors.leaf }]}>{t('notif_markAllRead')}</Text>
          </Pressable>
        }
      />
      <ScreenScroll contentInsetBottom={40}>
        {items.length === 0 ? (
          <EmptyState
            icon={<BellIcon size={22} color={colors.leaf} />}
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
  container: { flex: 1 },
  markAllButton: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  markAllLabel: { ...text.label },
});

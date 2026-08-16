import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

/** Fixed support-chat entry point, pinned flush above the bottom tab bar on every platform. */
export function SupportFab() {
  const t = useT();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <Pressable
      onPress={() => router.push('/(app)/support/chat')}
      accessibilityRole="button"
      accessibilityLabel={t('shop_askForSupport')}
      style={[styles.fab, { bottom: tabBarHeight + space.sm }]}
    >
      <Text style={styles.label}>{t('shop_askForSupport')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: space.lg,
    minHeight: hit.min,
    backgroundColor: color.pine,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label, color: color.paper },
});

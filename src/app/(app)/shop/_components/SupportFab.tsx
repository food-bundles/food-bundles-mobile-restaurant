import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export function SupportFab() {
  const t = useT();

  return (
    <Pressable
      onPress={() => router.push('/(app)/support/chat')}
      accessibilityRole="button"
      accessibilityLabel={t('shop_askForSupport')}
      style={styles.fab}
    >
      <Text style={styles.label}>{t('shop_askForSupport')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: space.lg,
    bottom: 88,
    minHeight: 44,
    backgroundColor: color.pine,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label, color: color.paper },
});

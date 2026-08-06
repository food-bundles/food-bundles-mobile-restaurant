import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { SearchIcon } from '@/components/icons';
import { useT } from '@/i18n';

export function SearchTrigger() {
  const t = useT();

  return (
    <Pressable
      onPress={() => router.push('/(app)/shop/search')}
      accessibilityRole="button"
      accessibilityLabel={t('shop_searchProduce')}
      style={styles.container}
    >
      <SearchIcon />
      <Text style={styles.label}>{t('shop_searchProduce')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: hit.min,
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  label: { ...text.body, color: color.muted },
});

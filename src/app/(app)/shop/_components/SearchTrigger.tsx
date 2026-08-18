import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { SearchIcon } from '@/components/icons';
import { useT } from '@/i18n';

export function SearchTrigger() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => router.push('/(app)/shop/search')}
      accessibilityRole="button"
      accessibilityLabel={t('shop_searchProduce')}
      style={[styles.container, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
    >
      <SearchIcon />
      <Text style={[styles.label, { color: colors.muted }]}>{t('shop_searchProduce')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: hit.min,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  label: { ...text.body },
});

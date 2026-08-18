import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { hit, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export function SeeAllLink() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => router.push('/(app)/shop/category')}
      accessibilityRole="button"
      accessibilityLabel={t('shop_seeAll')}
      style={styles.button}
    >
      <Text style={[styles.label, { color: colors.leaf }]}>{t('shop_seeAll')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  label: { ...text.label },
});

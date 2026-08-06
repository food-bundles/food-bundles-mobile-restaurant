import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { useT } from '@/i18n';

export function SeeAllLink() {
  const t = useT();

  return (
    <Pressable
      onPress={() => router.push('/(app)/shop/category')}
      accessibilityRole="button"
      accessibilityLabel={t('shop_seeAll')}
      style={styles.button}
    >
      <Text style={styles.label}>{t('shop_seeAll')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: hit.min, paddingHorizontal: space.xs, alignItems: 'center', justifyContent: 'center' },
  label: { ...text.label, color: color.leaf },
});

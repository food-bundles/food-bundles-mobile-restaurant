import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { PersonIcon } from '@/components/icons';
import { useT } from '@/i18n';

export function LandingHeader() {
  const t = useT();

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>FoodBundles</Text>
      <Pressable
        onPress={() => router.push('/(public)/guest/shop')}
        accessibilityRole="button"
        accessibilityLabel={t('landing_shopNow')}
        style={styles.shopNowButton}
      >
        <Text style={styles.shopNowLabel}>{t('landing_shopNow')}</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/(auth)/login')}
        accessibilityRole="button"
        accessibilityLabel={t('landing_login')}
        style={styles.loginButton}
      >
        <PersonIcon color={color.pine} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
    backgroundColor: color.oat,
  },
  brand: { ...text.h2, color: color.ink, flex: 1 },
  shopNowButton: {
    minHeight: hit.min,
    paddingHorizontal: space.lg,
    backgroundColor: color.leaf,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopNowLabel: { ...text.label, color: color.paper },
  loginButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

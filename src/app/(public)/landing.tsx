import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { PersonIcon } from '@/components/icons';

export default function Landing() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>FoodBundles</Text>
        <Pressable
          onPress={() => router.push('/(public)/guest/shop')}
          accessibilityRole="button"
          accessibilityLabel="Shop now"
          style={styles.shopNowButton}
        >
          <Text style={styles.shopNowLabel}>Shop Now</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel="Log in or sign up"
          style={styles.loginButton}
        >
          <PersonIcon color={color.pine} />
        </Pressable>
      </View>
      <Text style={styles.hero}>Fresh Quality Ingredients From Our Farm</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
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
  hero: { ...text.h1, color: color.ink, padding: space.lg },
});

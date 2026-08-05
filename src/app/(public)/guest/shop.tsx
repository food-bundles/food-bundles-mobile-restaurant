import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, radius, text } from '@/theme';
import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';

export default function GuestShop() {
  return (
    <PlaceholderScreen title="Shop as Guest">
      <Pressable
        onPress={() => router.push('/(public)/guest/cart')}
        accessibilityRole="button"
        accessibilityLabel="Open guest basket"
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>View basket</Text>
      </Pressable>
    </PlaceholderScreen>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { ...text.bodySemi, color: color.paper },
});

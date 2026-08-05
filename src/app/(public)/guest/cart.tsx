import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, radius, text } from '@/theme';
import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';

export default function GuestCart() {
  return (
    <PlaceholderScreen title="Your basket">
      <Pressable
        onPress={() => router.push('/(public)/guest/delivery')}
        accessibilityRole="button"
        accessibilityLabel="Checkout as guest"
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>Checkout as guest</Text>
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

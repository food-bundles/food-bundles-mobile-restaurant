import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, radius, text } from '@/theme';
import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';

export default function GuestDelivery() {
  return (
    <PlaceholderScreen title="Delivery details">
      <Pressable
        onPress={() => router.push('/(public)/guest/payment')}
        accessibilityRole="button"
        accessibilityLabel="Continue to payment"
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>Continue to payment</Text>
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

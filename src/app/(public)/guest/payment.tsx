import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, radius, text } from '@/theme';
import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';

export default function GuestPayment() {
  return (
    <PlaceholderScreen title="Payment">
      <Pressable
        onPress={() => router.replace('/(public)/guest/confirmation')}
        accessibilityRole="button"
        accessibilityLabel="Pay"
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>Pay</Text>
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

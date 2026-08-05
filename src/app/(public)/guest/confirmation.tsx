import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, radius, text } from '@/theme';
import { PlaceholderScreen } from '@/components/layout/PlaceholderScreen';

export default function GuestConfirmation() {
  return (
    <PlaceholderScreen title="Order placed" canGoBack={false}>
      <Pressable
        onPress={() => router.replace('/(public)/guest/shop')}
        accessibilityRole="button"
        accessibilityLabel="Continue browsing"
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>Continue browsing</Text>
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

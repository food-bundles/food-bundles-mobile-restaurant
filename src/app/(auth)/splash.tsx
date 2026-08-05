import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { color, text } from '@/theme';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/(public)/landing'), 1700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.replace('/(public)/landing')}
      accessibilityRole="button"
      accessibilityLabel="Skip splash screen"
    >
      <Text style={styles.title}>FoodBundles</Text>
      <Text style={styles.subtitle}>Fresh produce, sourced right.</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.pine,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: { ...text.display, color: color.paper },
  subtitle: { ...text.body, color: color.onPineBright },
});

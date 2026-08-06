import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { LogoMark } from '@/components/icons';

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
      <View style={styles.center}>
        <LogoMark size={78} />
        <View style={styles.textCol}>
          <Text style={styles.title}>FoodBundles</Text>
          <Text style={styles.subtitle}>Fresh produce, sourced right.</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={styles.progressTrackDim} />
        <View style={styles.progressFill} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.pine, justifyContent: 'space-between', paddingVertical: space.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.lg },
  textCol: { alignItems: 'center', gap: space.xs },
  title: { ...text.display, color: color.paper },
  subtitle: { ...text.body, color: color.onPineBright },
  progressTrack: {
    height: 4,
    borderRadius: radius.sm,
    marginHorizontal: space.xxl + space.lg,
    overflow: 'hidden',
  },
  progressTrackDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.onPine,
    opacity: 0.3,
  },
  progressFill: { width: '66%', height: '100%', backgroundColor: color.marigold, borderRadius: radius.sm },
});

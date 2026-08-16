import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color, duration, radius, space, text } from '@/theme';

export interface ToastProps {
  message: string | null;
  onHide: () => void;
}

const VISIBLE_MS = 2000;

export function Toast({ message, onHide }: ToastProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!message) return;
    opacity.value = withTiming(1, { duration: duration.overlay });
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: duration.overlay });
      setTimeout(onHide, duration.overlay);
    }, VISIBLE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!message) return null;

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      pointerEvents="none"
      style={[styles.toast, animatedStyle]}
    >
      <Text style={styles.label}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    bottom: space.xl,
    backgroundColor: color.ink,
    borderRadius: radius.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    alignItems: 'center',
  },
  label: { ...text.bodySemi, color: color.paper },
});

import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { color } from '@/theme';

export function RailPulseDot() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 1;
      opacity.value = 0;
      return;
    }
    scale.value = withRepeat(withTiming(2.2, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);
    opacity.value = withRepeat(withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [scale, opacity, reduceMotion]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={styles.wrap}>
      <Animated.View style={[styles.ring, pulseStyle]} />
      <Animated.View style={styles.core} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.marigold,
  },
  core: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: color.marigold,
    borderWidth: 3,
    borderColor: color.paper,
  },
});

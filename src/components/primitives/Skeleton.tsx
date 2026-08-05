import { useEffect } from 'react';
import { StyleSheet, type DimensionValue } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { color, radius } from '@/theme';

export interface SkeletonProps {
  width: DimensionValue;
  height: DimensionValue;
  radius?: number;
}

export function Skeleton({ width, height, radius: cornerRadius = radius.sm }: SkeletonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1400 }), -1, false);
    return () => cancelAnimation(progress);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.6 + progress.value * 0.4,
  }));

  return (
    <Animated.View
      accessible={false}
      style={[
        styles.base,
        { width, height, borderRadius: cornerRadius },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: color.neutral },
});

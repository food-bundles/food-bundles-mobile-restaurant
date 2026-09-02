import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { signatureDuration } from '@/theme';

const STAGGER_STEP_MS = 45;
const MAX_STAGGER_INDEX = 8;

export interface StaggeredGridCellProps {
  index: number;
  children: React.ReactNode;
}

/** Fades and rises a grid cell in on mount, staggered by its position — used for product card entrances. */
export function StaggeredGridCell({ index, children }: StaggeredGridCellProps) {
  const entrance = useSharedValue(0);

  useEffect(() => {
    const delay = Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP_MS;
    entrance.value = withDelay(delay, withTiming(1, { duration: signatureDuration.carouselCardEntrance }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 10 }],
  }));

  return <Animated.View style={[styles.cell, animatedStyle]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  cell: { flex: 1 },
});

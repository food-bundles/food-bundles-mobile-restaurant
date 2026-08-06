import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { color, easing } from '@/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHECK_PATH_LENGTH = 20;

export function ConfirmationCheck() {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);
  const dashOffset = useSharedValue(CHECK_PATH_LENGTH);

  useEffect(() => {
    scale.value = withDelay(250, withTiming(1, { duration: 400, easing: easing.spring }));
    opacity.value = withDelay(250, withTiming(1, { duration: 200 }));
    dashOffset.value = withDelay(450, withTiming(0, { duration: 350 }));
  }, [scale, opacity, dashOffset]);

  const discStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pathProps = useAnimatedProps(() => ({ strokeDashoffset: dashOffset.value }));

  return (
    <Animated.View style={[styles.disc, discStyle]}>
      <Svg viewBox="0 0 24 24" width={28} height={28} fill="none">
        <AnimatedPath
          d="M20 6 9 17l-5-5"
          stroke={color.paper}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={CHECK_PATH_LENGTH}
          animatedProps={pathProps}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: color.ripe,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

import { StyleSheet } from 'react-native';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { tabBarTranslateY } from '@/stores/tabBarVisibilityStore';

/**
 * Wraps the default bottom tab bar in an `Animated.View` driven by the shared
 * `tabBarTranslateY` value, so scroll-tracked screens can slide it away on scroll-down
 * and back in on scroll-up without Expo Router's `Tabs` needing a first-class API for it.
 */
export function AnimatedTabBar(props: BottomTabBarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslateY.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <BottomTabBar {...props} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});

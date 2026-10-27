import { StyleSheet } from 'react-native';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { tabBarTranslateY } from '@/stores/tabBarVisibilityStore';

export function AnimatedTabBar(props: React.ComponentProps<typeof BottomTabBar>) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslateY.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <BottomTabBar {...props as BottomTabBarProps} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});

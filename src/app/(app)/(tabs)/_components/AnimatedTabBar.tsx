import { useAnimatedStyle } from 'react-native-reanimated';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { tabBarTranslateY } from '@/stores/tabBarVisibilityStore';

export function AnimatedTabBar(props: BottomTabBarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslateY.value }],
  }));

  return <BottomTabBar {...props} style={animatedStyle as any} />;
}

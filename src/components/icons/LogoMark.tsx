import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { color, radius } from '@/theme';

export interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 48 }: LogoMarkProps) {
  const iconSize = Math.round(size * 0.55);

  return (
    <View
      accessible
      accessibilityLabel="FoodBundles"
      style={[styles.container, { width: size, height: size, borderRadius: radius.md }]}
    >
      <Svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="none">
        <Path
          d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 8z"
          stroke={color.marigold}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.5 8a3.5 3.5 0 0 1 7 0"
          stroke={color.marigold}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

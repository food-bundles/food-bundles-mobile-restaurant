import Svg, { Circle, Path } from 'react-native-svg';
import { color as themeColor } from '@/theme';
import type { IconProps } from './types';

export function SearchIcon({ size = 20, color = themeColor.muted }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} />
      <Path d="M21 21l-4-4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

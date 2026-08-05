import Svg, { Circle, Path } from 'react-native-svg';
import { color as themeColor } from '@/theme';
import type { IconProps } from './types';

export function BasketIcon({ size = 20, color = themeColor.ink }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M6 6h15l-1.5 9h-12z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M6 6 5 3H2" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={9} cy={20} r={1.4} stroke={color} strokeWidth={1.9} />
      <Circle cx={18} cy={20} r={1.4} stroke={color} strokeWidth={1.9} />
    </Svg>
  );
}

import Svg, { Circle, Path } from 'react-native-svg';
import { color as themeColor } from '@/theme';
import type { IconProps } from './types';

export function HelpIcon({ size = 18, color = themeColor.ink }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.9} />
      <Path
        d="M9.5 9a2.5 2.5 0 0 1 4 2c0 1.5-2 2-2 3.2M12 17h.01"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

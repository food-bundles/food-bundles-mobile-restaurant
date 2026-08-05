import Svg, { Path } from 'react-native-svg';
import { color as themeColor } from '@/theme';
import type { IconProps } from './types';

export function CheckIcon({ size = 20, color = themeColor.paper }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M20 6 9 17l-5-5"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

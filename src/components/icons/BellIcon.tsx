import Svg, { Path } from 'react-native-svg';
import { color as themeColor } from '@/theme';
import type { IconProps } from './types';

export function BellIcon({ size = 20, color = themeColor.ink }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.5 21a1.8 1.8 0 0 0 3 0"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

import Svg, { Path } from 'react-native-svg';
import { color as themeColor } from '@/theme';
import type { IconProps } from './types';

export function RefreshIcon({ size = 18, color = themeColor.leaf }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M18 4v4h-4M6 20v-4h4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

import Svg, { Path } from 'react-native-svg';
import { color as themeColor } from '@/theme';
import type { IconProps } from './types';

export function PlusIcon({ size = 20, color = themeColor.ink }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

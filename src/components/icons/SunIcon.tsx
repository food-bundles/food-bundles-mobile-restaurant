import Svg, { Circle, Line } from 'react-native-svg';
import { color as themeColor } from '@/theme';
import type { IconProps } from './types';

export function SunIcon({ size = 24, color = themeColor.marigold }: IconProps) {
  const rays = Array.from({ length: 8 }, (_, index) => index * 45);

  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Circle cx={12} cy={12} r={5} fill={color} />
      {rays.map((angle) => (
        <Line
          key={angle}
          x1={12}
          y1={2.5}
          x2={12}
          y2={5}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </Svg>
  );
}

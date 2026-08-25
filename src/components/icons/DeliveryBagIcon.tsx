import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import type { IconProps } from './types';

/** A shopping-bag-with-handles glyph representing the Vuba Vuba data source. */
export function DeliveryBagIcon({ size = 20, color }: IconProps) {
  const { colors } = useTheme();
  const resolvedColor = color ?? colors.ink;
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M5.5 8h13l-1 12H6.5l-1-12z"
        stroke={resolvedColor}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <Path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        stroke={resolvedColor}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

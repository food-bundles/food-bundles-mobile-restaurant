import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import type { IconProps } from './types';

/** A lightning-bolt glyph representing the EUCL Cash Power data source. */
export function PowerBoltIcon({ size = 20, color }: IconProps) {
  const { colors } = useTheme();
  const resolvedColor = color ?? colors.ink;
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M13 3 6 13.5h5L10.5 21 18 10.2h-5.2L13 3z"
        stroke={resolvedColor}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

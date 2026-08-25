import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import type { IconProps } from './types';

/** A torn-edge receipt glyph representing the RRA EBM data source. */
export function ReceiptIcon({ size = 20, color }: IconProps) {
  const { colors } = useTheme();
  const resolvedColor = color ?? colors.ink;
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M6 3h12v17.2l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2V3z"
        stroke={resolvedColor}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <Path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke={resolvedColor} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '@/theme';
import type { IconProps } from './types';

/** A point-of-sale terminal glyph representing the Kayko POS data source. */
export function PosTerminalIcon({ size = 20, color }: IconProps) {
  const { colors } = useTheme();
  const resolvedColor = color ?? colors.ink;
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Rect x={4.5} y={4} width={15} height={11} rx={1.5} stroke={resolvedColor} strokeWidth={1.7} />
      <Path d="M7.5 7.5h5M7.5 10.5h9" stroke={resolvedColor} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M9 15v3.5M15 15v3.5" stroke={resolvedColor} strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M7 18.5h10" stroke={resolvedColor} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

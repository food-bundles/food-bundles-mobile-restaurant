import { Text, type TextStyle } from 'react-native';
import { color, text } from '@/theme';
import { formatRwf } from '@/lib';

export type PriceSize = 'hero' | 'lg' | 'md';

export interface PriceTextProps {
  amount: number;
  size?: PriceSize;
  suffix?: string;
  colorOverride?: string;
}

const SIZE_STYLE: Record<PriceSize, TextStyle> = {
  hero: text.priceHero,
  lg: text.priceLg,
  md: text.priceMd,
};

export function PriceText({ amount, size = 'md', suffix, colorOverride }: PriceTextProps) {
  return (
    <Text
      style={[
        SIZE_STYLE[size],
        { color: colorOverride ?? color.ink, fontVariant: ['tabular-nums'] },
      ]}
    >
      {formatRwf(amount)}
      {suffix ? ` ${suffix}` : ''}
    </Text>
  );
}

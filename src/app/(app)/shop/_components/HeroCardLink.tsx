import { StyleSheet, Text } from 'react-native';
import { text, useTheme, type ColorPalette } from '@/theme';

export interface HeroCardLinkProps {
  label: string;
  tone?: 'marigold' | 'leaf' | 'onPine';
}

const toneColor = (colors: ColorPalette): Record<NonNullable<HeroCardLinkProps['tone']>, string> => ({
  marigold: colors.marigold,
  leaf: colors.leaf,
  onPine: colors.onPineBright,
});

export function HeroCardLink({ label, tone = 'marigold' }: HeroCardLinkProps) {
  const { colors } = useTheme();
  return <Text style={[styles.link, { color: toneColor(colors)[tone] }]}>{label} →</Text>;
}

const styles = StyleSheet.create({
  link: { ...text.label },
});

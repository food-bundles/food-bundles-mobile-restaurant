import { StyleSheet, Text } from 'react-native';
import { color, text } from '@/theme';

export interface HeroCardLinkProps {
  label: string;
  tone?: 'marigold' | 'leaf' | 'onPine';
}

const TONE_COLOR: Record<NonNullable<HeroCardLinkProps['tone']>, string> = {
  marigold: color.marigold,
  leaf: color.leaf,
  onPine: color.onPineBright,
};

export function HeroCardLink({ label, tone = 'marigold' }: HeroCardLinkProps) {
  return <Text style={[styles.link, { color: TONE_COLOR[tone] }]}>{label} →</Text>;
}

const styles = StyleSheet.create({
  link: { ...text.label },
});

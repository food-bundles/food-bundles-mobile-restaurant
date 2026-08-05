import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';

export type BadgeTone = 'neutral' | 'leaf' | 'ripe' | 'marigold' | 'chili';

export interface BadgeProps {
  tone: BadgeTone;
  label: string;
  dashed?: boolean;
}

const TONE_BG: Record<BadgeTone, string> = {
  neutral: color.neutral,
  leaf: color.tintLeaf,
  ripe: color.tintRipe,
  marigold: color.tintMarigold,
  chili: color.tintChili,
};

const TONE_TEXT: Record<BadgeTone, string> = {
  neutral: color.secondary,
  leaf: color.pine,
  ripe: color.tintedGreenText,
  marigold: color.tintedAmberText,
  chili: color.tintedRedText,
};

export function Badge({ tone, label, dashed = false }: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: TONE_BG[tone] },
        dashed && styles.dashed,
      ]}
    >
      <Text style={[styles.label, { color: TONE_TEXT[tone] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: space.md - 1,
    paddingVertical: space.xs + 1,
    alignSelf: 'flex-start',
  },
  dashed: { borderWidth: 1, borderStyle: 'dashed', borderColor: color.refundedDashed },
  label: { ...text.overline },
});

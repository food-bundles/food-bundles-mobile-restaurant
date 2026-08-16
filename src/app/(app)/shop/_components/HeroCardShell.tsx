import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';

export type HeroCardTone = 'dark' | 'photo' | 'paper' | 'cream';

export interface HeroCardShellProps {
  onPress: () => void;
  accessibilityLabel: string;
  tone: HeroCardTone;
  overline: string;
  badge?: string;
  children: React.ReactNode;
  background?: React.ReactNode;
}

const TONE_BG: Record<HeroCardTone, string> = {
  dark: color.pine,
  photo: color.pine,
  paper: color.paper,
  cream: color.tintMarigoldSoft,
};

const TONE_OVERLINE: Record<HeroCardTone, string> = {
  dark: color.onPine,
  photo: color.onPine,
  paper: color.secondary,
  cream: color.tintedAmberText,
};

export function HeroCardShell({
  onPress,
  accessibilityLabel,
  tone,
  overline,
  badge,
  children,
  background,
}: HeroCardShellProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, { backgroundColor: TONE_BG[tone] }]}
    >
      {background}
      <View style={styles.headerRow}>
        <Text style={[styles.overline, { color: TONE_OVERLINE[tone] }]}>{overline}</Text>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{badge}</Text>
          </View>
        ) : null}
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 142,
    borderRadius: radius.lg,
    padding: space.md,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  overline: { ...text.overline },
  badge: {
    backgroundColor: color.marigold,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  badgeLabel: { ...text.micro, color: color.pine },
});

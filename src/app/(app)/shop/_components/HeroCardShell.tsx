import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { duration, radius, space, text, useTheme, type ColorPalette } from '@/theme';

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

const toneBg = (colors: ColorPalette): Record<HeroCardTone, string> => ({
  dark: colors.pine,
  photo: colors.pine,
  paper: colors.paper,
  cream: colors.tintMarigoldSoft,
});

const toneOverline = (colors: ColorPalette): Record<HeroCardTone, string> => ({
  dark: colors.onPine,
  photo: colors.onPine,
  paper: colors.secondary,
  cream: colors.tintedAmberText,
});

export function HeroCardShell({
  onPress,
  accessibilityLabel,
  tone,
  overline,
  badge,
  children,
  background,
}: HeroCardShellProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.98, { duration: duration.press });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: duration.press });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[styles.card, { backgroundColor: toneBg(colors)[tone] }]}
      >
        {background}
        <View style={styles.headerRow}>
          <Text style={[styles.overline, { color: toneOverline(colors)[tone] }]}>{overline}</Text>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: colors.marigold }]}>
              <Text style={[styles.badgeLabel, { color: colors.pine }]}>{badge}</Text>
            </View>
          ) : null}
        </View>
        {children}
      </Pressable>
    </Animated.View>
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
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  badgeLabel: { ...text.micro },
});

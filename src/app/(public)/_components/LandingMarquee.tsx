import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

const RESTAURANTS = [
  'Imboni',
  'Laza',
  "Mr Chip's",
  'Tugende Hostel',
  'Food & Stuff',
  'Sole Luna',
  'Petit Marché',
  'Simple by Inki',
  'Ewaka',
  'Bicu Lounge',
  'Mukati na Butta',
  'Country Roots',
];

function Chip({ name }: { name: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{name}</Text>
    </View>
  );
}

export function LandingMarquee() {
  const t = useT();
  const translateX = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) return;
      translateX.value = withRepeat(withTiming(-1000, { duration: 30000, easing: Easing.linear }), -1, false);
    });
    return () => cancelAnimation(translateX);
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  return (
    <View>
      <Text style={styles.label}>{t('landing_trustedBy')}</Text>
      <View style={styles.viewport}>
        <Animated.View style={[styles.track, animatedStyle]}>
          {[...RESTAURANTS, ...RESTAURANTS].map((name, index) => (
            <Chip key={`${name}-${index}`} name={name} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...text.overline,
    color: color.secondary,
    paddingHorizontal: space.lg,
    marginBottom: space.sm,
  },
  viewport: { overflow: 'hidden' },
  track: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg },
  chip: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  chipLabel: { ...text.label, color: color.ink },
});

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { radius, signatureDuration, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';

export interface LimitPreviewBarProps {
  limitRwf: number;
  maxLimitRwf: number;
}

/** Animated "estimated limit" bar: counts up and fills left-to-right as consent sources are toggled. */
export function LimitPreviewBar({ limitRwf, maxLimitRwf }: LimitPreviewBarProps) {
  const t = useT();
  const { colors } = useTheme();
  const animatedLimit = useSharedValue(limitRwf);
  const [displayLimit, setDisplayLimit] = useState(limitRwf);

  useEffect(() => {
    animatedLimit.value = withTiming(limitRwf, { duration: signatureDuration.limitPreviewCountUp });
  }, [limitRwf, animatedLimit]);

  useAnimatedReaction(
    () => Math.round(animatedLimit.value),
    (rounded, previous) => {
      if (rounded !== previous) runOnJS(setDisplayLimit)(rounded);
    },
  );

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.min(100, (animatedLimit.value / maxLimitRwf) * 100)}%`,
  }));

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.leaf }]}>
        {t('consent_estimatedLimit', { amount: formatRwf(displayLimit) })}
      </Text>
      <View style={[styles.track, { backgroundColor: colors.neutral }]}>
        <Animated.View style={[styles.fill, { backgroundColor: colors.leaf }, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: space.md },
  label: { ...text.h2, textAlign: 'center', fontVariant: ['tabular-nums'] },
  track: { height: 8, borderRadius: radius.sm, overflow: 'hidden', marginTop: space.sm },
  fill: { height: '100%', borderRadius: radius.sm },
});

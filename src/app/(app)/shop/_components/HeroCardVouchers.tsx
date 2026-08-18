import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { radius, signatureDuration, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';

export interface HeroCardVouchersProps {
  phase: 1 | 2;
  overline: string;
  subscribed: boolean;
  title: string;
  subtitle: string;
  linkLabel: string;
  usedFraction?: number;
  available?: number;
  settlementLabel: string;
  unlockCta: string;
  onPress: () => void;
}

export function HeroCardVouchers({
  phase,
  overline,
  subscribed,
  title,
  subtitle,
  linkLabel,
  usedFraction = 0,
  available = 0,
  settlementLabel,
  unlockCta,
  onPress,
}: HeroCardVouchersProps) {
  const { colors } = useTheme();
  const fade = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    fade.value = phase === 2 ? withTiming(1, { duration: signatureDuration.carouselPhaseFade }) : withTiming(0);
    if (phase === 2 && !subscribed) {
      shimmer.value = 0;
      shimmer.value = withTiming(1, { duration: signatureDuration.carouselShimmerSweep });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value < 1 ? 0.5 : 0,
    transform: [{ translateX: (shimmer.value - 0.5) * 200 }],
  }));

  return (
    <HeroCardShell onPress={onPress} accessibilityLabel={`${overline}, ${title}`} tone="dark" overline={overline}>
      <View>
        {subscribed ? (
          <View style={[styles.creditBar, { backgroundColor: colors.onPineSoft }]}>
            <View
              style={[styles.creditFill, { width: `${Math.round(usedFraction * 100)}%`, backgroundColor: colors.marigold }]}
            />
          </View>
        ) : null}
        <Text style={[styles.title, { color: colors.paper }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.onPineSoft }]}>{subtitle}</Text>
        {subscribed ? <Text style={[styles.available, { color: colors.paper }]}>{formatRwf(available)}</Text> : null}
        {phase === 2 && subscribed ? (
          <Animated.Text style={[styles.settlement, { color: colors.onPine }, fadeStyle]}>
            {settlementLabel}
          </Animated.Text>
        ) : null}
        {phase === 2 && !subscribed ? (
          <Animated.View style={[styles.unlockRow, fadeStyle]}>
            <View style={styles.unlockWrap}>
              <Text style={[styles.unlockLabel, { color: colors.marigold }]}>{unlockCta} →</Text>
              <Animated.View style={[styles.shimmer, { backgroundColor: colors.paper }, shimmerStyle]} />
            </View>
          </Animated.View>
        ) : null}
      </View>
      <HeroCardLink label={linkLabel} />
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  creditBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: space.sm,
  },
  creditFill: { height: '100%', borderRadius: radius.sm },
  title: { ...text.h2 },
  subtitle: { ...text.caption, marginTop: 2 },
  available: { ...text.priceLg, marginTop: space.xs },
  settlement: { ...text.caption, marginTop: 4 },
  unlockRow: { marginTop: space.xs },
  unlockWrap: { position: 'relative', overflow: 'hidden', alignSelf: 'flex-start' },
  unlockLabel: { ...text.label },
  shimmer: { position: 'absolute', top: 0, bottom: 0, width: 40 },
});

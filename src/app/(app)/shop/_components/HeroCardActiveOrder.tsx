import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { color, signatureDuration, space, text } from '@/theme';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';
import { ORDER_STEPS } from '@/mocks/types';
import type { Order } from '@/mocks/types';

export interface HeroCardActiveOrderProps {
  order: Order;
  phase: 1 | 2;
  statusLabel: string;
  arrivingLabel: string;
  etaLabel: string;
  overline: string;
  stepLabel: string;
  linkLabel: string;
  onPress: () => void;
}

export function HeroCardActiveOrder({
  order,
  phase,
  statusLabel,
  arrivingLabel,
  etaLabel,
  overline,
  stepLabel,
  linkLabel,
  onPress,
}: HeroCardActiveOrderProps) {
  const progress = useSharedValue(0);
  const metaOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const targetFraction = Math.min(order.step, ORDER_STEPS.length) / ORDER_STEPS.length;

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(targetFraction, { duration: signatureDuration.carouselProgressWipe });
  }, [progress, targetFraction]);

  useEffect(() => {
    metaOpacity.value = withTiming(0, { duration: signatureDuration.carouselPhaseFade / 2 }, () => {
      metaOpacity.value = withTiming(1, { duration: signatureDuration.carouselPhaseFade / 2 });
    });
    if (phase === 2) {
      pulseScale.value = withSequence(
        withTiming(1.06, { duration: signatureDuration.carouselPulseScale / 2 }),
        withTiming(1, { duration: signatureDuration.carouselPulseScale / 2 }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    transform: [{ scaleY: pulseScale.value }],
  }));
  const metaStyle = useAnimatedStyle(() => ({ opacity: metaOpacity.value }));

  return (
    <HeroCardShell
      onPress={onPress}
      accessibilityLabel={`${overline}, ${order.id}, ${stepLabel}`}
      tone="dark"
      overline={overline}
      badge={statusLabel}
    >
      <View>
        <Text style={styles.orderId}>{order.id}</Text>
        <Animated.Text style={[styles.meta, metaStyle]}>{phase === 1 ? arrivingLabel : etaLabel}</Animated.Text>
        <View style={styles.track}>
          {ORDER_STEPS.map((_, index) => (
            <View key={index} style={styles.segment} />
          ))}
          <Animated.View style={[styles.fill, fillStyle]} />
        </View>
      </View>
      <HeroCardLink label={linkLabel} />
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  orderId: { ...text.h2, color: color.paper },
  meta: { ...text.caption, color: color.onPineSoft, marginTop: 2 },
  track: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    backgroundColor: color.onPineSoft,
    overflow: 'hidden',
    marginTop: space.sm,
  },
  segment: { flex: 1 },
  fill: { position: 'absolute', top: 0, left: 0, bottom: 0, backgroundColor: color.marigold, borderRadius: 3 },
});

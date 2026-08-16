import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color, signatureDuration, space, text } from '@/theme';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';
import { ORDER_STEPS } from '@/mocks/types';
import type { Order } from '@/mocks/types';

export interface HeroCardActiveOrderProps {
  order: Order;
  statusLabel: string;
  arrivingLabel: string;
  overline: string;
  stepLabel: string;
  linkLabel: string;
  onPress: () => void;
}

export function HeroCardActiveOrder({
  order,
  statusLabel,
  arrivingLabel,
  overline,
  stepLabel,
  linkLabel,
  onPress,
}: HeroCardActiveOrderProps) {
  const progress = useSharedValue(0);
  const targetFraction = Math.min(order.step, ORDER_STEPS.length) / ORDER_STEPS.length;

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(targetFraction, { duration: signatureDuration.carouselProgressWipe });
  }, [progress, targetFraction]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

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
        <Text style={styles.meta}>{arrivingLabel}</Text>
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

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';
import { signatureDuration, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';

export interface HeroCardWalletProps {
  phase: 1 | 2;
  overline: string;
  balance: number;
  subtitle: string;
  lastTransactionLabel: string;
  linkLabel: string;
  onPress: () => void;
}

export function HeroCardWallet({
  phase,
  overline,
  balance,
  subtitle,
  lastTransactionLabel,
  linkLabel,
  onPress,
}: HeroCardWalletProps) {
  const { colors } = useTheme();
  const fade = useSharedValue(0);
  const countUp = useSharedValue(0);
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    fade.value = phase === 2 ? withTiming(1, { duration: signatureDuration.carouselPhaseFade }) : withTiming(0);
  }, [fade, phase]);

  useEffect(() => {
    countUp.value = 0;
    countUp.value = withTiming(balance, { duration: signatureDuration.limitPreviewCountUp });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance]);

  useAnimatedReaction(
    () => Math.round(countUp.value),
    (rounded, previous) => {
      if (rounded !== previous) runOnJS(setDisplayBalance)(rounded);
    },
  );

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <HeroCardShell onPress={onPress} accessibilityLabel={`${overline}, ${subtitle}`} tone="dark" overline={overline}>
      <View>
        <Text style={[styles.balance, { color: colors.paper }]}>{formatRwf(displayBalance)}</Text>
        <Text style={[styles.subtitle, { color: colors.onPineSoft }]}>{subtitle}</Text>
        {phase === 2 ? (
          <Animated.Text style={[styles.transaction, { color: colors.onPine }, fadeStyle]}>
            {lastTransactionLabel}
          </Animated.Text>
        ) : null}
      </View>
      <HeroCardLink label={linkLabel} />
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  balance: { ...text.priceHero, fontVariant: ['tabular-nums'] },
  subtitle: { ...text.caption, marginTop: 2 },
  transaction: { ...text.caption, marginTop: 4 },
});

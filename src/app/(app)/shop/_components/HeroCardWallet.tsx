import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { PriceText } from '@/components/product';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';
import { signatureDuration, text, useTheme } from '@/theme';

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

  useEffect(() => {
    fade.value = phase === 2 ? withTiming(1, { duration: signatureDuration.carouselPhaseFade }) : withTiming(0);
  }, [fade, phase]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <HeroCardShell onPress={onPress} accessibilityLabel={`${overline}, ${subtitle}`} tone="dark" overline={overline}>
      <View>
        <PriceText amount={balance} size="hero" colorOverride={colors.paper} />
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
  subtitle: { ...text.caption, marginTop: 2 },
  transaction: { ...text.caption, marginTop: 4 },
});

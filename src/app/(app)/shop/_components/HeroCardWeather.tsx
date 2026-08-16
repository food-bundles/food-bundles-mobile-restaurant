import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { color, signatureDuration, space, text } from '@/theme';
import { SunIcon } from '@/components/icons';
import { HeroCardShell } from './HeroCardShell';
import { HeroCardLink } from './HeroCardLink';

export interface HeroCardWeatherProps {
  phase: 1 | 2;
  overline: string;
  title: string;
  subtitle: string;
  restockPrompt: string;
  linkLabel: string;
  onPress: () => void;
}

export function HeroCardWeather({
  phase,
  overline,
  title,
  subtitle,
  restockPrompt,
  linkLabel,
  onPress,
}: HeroCardWeatherProps) {
  const rotation = useSharedValue(0);
  const promptFade = useSharedValue(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(rotation);
      return;
    }
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, { duration: signatureDuration.carouselSunSpin, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  }, [reduceMotion, rotation]);

  useEffect(() => {
    promptFade.value =
      phase === 2 ? withTiming(1, { duration: signatureDuration.carouselPhaseFade }) : withTiming(0);
  }, [promptFade, phase]);

  const sunStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const promptStyle = useAnimatedStyle(() => ({ opacity: promptFade.value }));

  return (
    <HeroCardShell onPress={onPress} accessibilityLabel={`${overline}, ${title}`} tone="cream" overline={overline}>
      <View style={styles.row}>
        <Animated.View style={sunStyle}>
          <SunIcon size={28} />
        </Animated.View>
        <View style={styles.textCol}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View>
        {phase === 2 ? <Animated.Text style={[styles.prompt, promptStyle]}>{restockPrompt}</Animated.Text> : null}
        <View style={styles.linkGap}>
          <HeroCardLink label={linkLabel} />
        </View>
      </View>
    </HeroCardShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  textCol: { flex: 1 },
  title: { ...text.h2, color: color.ink },
  subtitle: { ...text.caption, color: color.secondary, marginTop: 2 },
  prompt: { ...text.caption, color: color.body },
  linkGap: { marginTop: space.xs },
});

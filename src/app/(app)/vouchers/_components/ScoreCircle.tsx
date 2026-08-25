import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { signatureDuration, text, useTheme } from '@/theme';
import type { CreditTier } from '@/mocks/types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 160;
const STROKE_WIDTH = 12;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Maximum score the arc represents; matches the spec's 0-300 scale. */
const MAX_SCORE = 300;

export interface ScoreCircleProps {
  tier: CreditTier;
  score: number;
}

/** Draws an animated arc from 0 to `score / 300` of the circle, with the tier letter centred. */
export function ScoreCircle({ tier, score }: ScoreCircleProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const fraction = Math.min(1, score / MAX_SCORE);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(fraction, { duration: signatureDuration.scoreCircleDraw });
  }, [fraction, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.hairline}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.leaf}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeLinecap="round"
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={styles.centre} pointerEvents="none">
        <Text style={[styles.tierLabel, { color: colors.ink }]}>{tier}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  centre: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  tierLabel: { ...text.display },
});

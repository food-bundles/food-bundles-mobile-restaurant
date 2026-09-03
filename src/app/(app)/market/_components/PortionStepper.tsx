import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { hit, radius, space, text, useTheme } from '@/theme';
import { MinusIcon, PlusIcon } from '@/components/icons';
import { useT } from '@/i18n';

const MIN_PORTIONS = 10;
const MAX_PORTIONS = 500;
const STEP = 10;
const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

export interface PortionStepperProps {
  value: number;
  onChange: (value: number) => void;
}

function snapToStep(raw: number): number {
  const stepped = Math.round(raw / STEP) * STEP;
  return Math.max(MIN_PORTIONS, Math.min(MAX_PORTIONS, stepped));
}

/** Covers-per-service picker: a draggable slider (10-500, step 10) with side −/+ steppers. */
export function PortionStepper({ value, onChange }: PortionStepperProps) {
  const t = useT();
  const { colors } = useTheme();
  const trackWidth = useSharedValue(0);
  const dragValue = useSharedValue(value);

  useEffect(() => {
    dragValue.value = value;
  }, [value, dragValue]);

  const onTrackLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width - THUMB_SIZE;
  };

  const commit = (raw: number) => onChange(snapToStep(raw));

  const valueToX = (val: number) => {
    const ratio = (val - MIN_PORTIONS) / (MAX_PORTIONS - MIN_PORTIONS);
    return ratio * trackWidth.value;
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (trackWidth.value <= 0) return;
      const ratio = Math.max(0, Math.min(1, event.x / trackWidth.value));
      dragValue.value = MIN_PORTIONS + ratio * (MAX_PORTIONS - MIN_PORTIONS);
    })
    .onEnd(() => {
      runOnJS(commit)(dragValue.value);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: valueToX(dragValue.value) }],
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: valueToX(dragValue.value) + THUMB_SIZE / 2,
  }));

  const onDec = () => onChange(Math.max(MIN_PORTIONS, value - STEP));
  const onInc = () => onChange(Math.min(MAX_PORTIONS, value + STEP));

  return (
    <View>
      <Text style={[styles.value, { color: colors.ink }]}>{value}</Text>
      <View style={styles.row}>
        <Pressable
          onPress={onDec}
          accessibilityRole="button"
          accessibilityLabel={t('a11y_decreaseQty')}
          style={styles.hitArea}
        >
          <View style={[styles.button, { backgroundColor: colors.tintLeaf }]}>
            <MinusIcon size={16} color={colors.leaf} />
          </View>
        </Pressable>
        <View style={styles.trackWrap} onLayout={onTrackLayout}>
          <View style={[styles.track, { backgroundColor: colors.hairline }]} />
          <Animated.View style={[styles.fill, { backgroundColor: colors.leaf }, fillStyle]} />
          <GestureDetector gesture={pan}>
            <Animated.View
              accessibilityRole="adjustable"
              accessibilityLabel={t('menu_coversPerService')}
              accessibilityValue={{ min: MIN_PORTIONS, max: MAX_PORTIONS, now: value }}
              style={[styles.thumb, { backgroundColor: colors.leaf, borderColor: colors.paper }, thumbStyle]}
            />
          </GestureDetector>
        </View>
        <Pressable
          onPress={onInc}
          accessibilityRole="button"
          accessibilityLabel={t('a11y_increaseQty')}
          style={styles.hitArea}
        >
          <View style={[styles.button, { backgroundColor: colors.tintLeaf }]}>
            <PlusIcon size={16} color={colors.leaf} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  value: { ...text.priceLg, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  hitArea: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  button: { width: 32, height: 32, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  trackWrap: { flex: 1, height: hit.min, justifyContent: 'center' },
  track: { height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2 },
  fill: { position: 'absolute', height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2 },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
  },
});

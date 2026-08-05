import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color, duration, radius, text } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'destructive';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  children: string;
  accessibilityLabel?: string;
}

const VARIANT_BG: Record<ButtonVariant, string> = {
  primary: color.leaf,
  secondary: color.paper,
  accent: color.marigold,
  destructive: color.chili,
};

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  primary: color.paper,
  secondary: color.ink,
  accent: color.pine,
  destructive: color.paper,
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  children,
  accessibilityLabel,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.98, { duration: duration.press });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: duration.press });
  }, [scale]);

  const handlePress = useCallback(
    (_event: GestureResponderEvent) => {
      if (!isDisabled) onPress();
    },
    [isDisabled, onPress],
  );

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[fullWidth && styles.fullWidth, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? children}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={[
          styles.base,
          size === 'md' ? styles.md : styles.sm,
          { backgroundColor: VARIANT_BG[variant] },
          variant === 'secondary' && styles.secondaryBorder,
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={VARIANT_TEXT[variant]} />
        ) : (
          <Text style={[styles.label, { color: VARIANT_TEXT[variant] }]}>{children}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  md: { minHeight: 48 },
  sm: { minHeight: 44 },
  fullWidth: { width: '100%' },
  secondaryBorder: { borderWidth: 1, borderColor: color.hairline },
  disabled: { opacity: 0.5 },
  label: { ...text.bodySemi },
});

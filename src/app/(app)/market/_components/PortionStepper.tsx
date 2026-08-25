import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { MinusIcon, PlusIcon } from '@/components/icons';
import { useT } from '@/i18n';

const MIN_PORTIONS = 10;
const MAX_PORTIONS = 500;
const STEP = 10;

export interface PortionStepperProps {
  value: number;
  onChange: (value: number) => void;
}

/** Stepper for "covers per service", clamped 10-500 in steps of 10. */
export function PortionStepper({ value, onChange }: PortionStepperProps) {
  const t = useT();
  const { colors } = useTheme();

  const onDec = () => onChange(Math.max(MIN_PORTIONS, value - STEP));
  const onInc = () => onChange(Math.min(MAX_PORTIONS, value + STEP));

  return (
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
      <Text style={[styles.value, { color: colors.ink }]}>{value}</Text>
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
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  hitArea: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  button: { width: 32, height: 32, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  value: { ...text.h2, minWidth: 48, textAlign: 'center' },
});

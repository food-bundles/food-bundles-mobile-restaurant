import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { MinusIcon, PlusIcon } from '@/components/icons';
import { useT } from '@/i18n';

export interface QuantityStepperProps {
  qty: number;
  onInc: () => void;
  onDec: () => void;
}

export function QuantityStepper({ qty, onInc, onDec }: QuantityStepperProps) {
  const t = useT();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onDec}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_decreaseQty')}
        hitSlop={8}
        style={styles.hitArea}
      >
        <View style={styles.visualButton}>
          <MinusIcon size={14} color={color.leaf} />
        </View>
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable
        onPress={onInc}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_increaseQty')}
        hitSlop={8}
        style={styles.hitArea}
      >
        <View style={styles.visualButton}>
          <PlusIcon size={14} color={color.leaf} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  hitArea: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  visualButton: {
    width: 27,
    height: 27,
    borderRadius: radius.pill,
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { ...text.bodySemi, color: color.ink, minWidth: 20, textAlign: 'center' },
});

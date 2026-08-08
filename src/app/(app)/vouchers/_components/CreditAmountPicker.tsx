import { Pressable, StyleSheet, View } from 'react-native';
import { color, hit, radius } from '@/theme';
import { PriceText } from '@/components/product';
import { MinusIcon, PlusIcon } from '@/components/icons';
import { useT } from '@/i18n';

const STEP = 10000;

export interface CreditAmountPickerProps {
  amount: number;
  onAdjust: (delta: number) => void;
}

export function CreditAmountPicker({ amount, onAdjust }: CreditAmountPickerProps) {
  const t = useT();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onAdjust(-STEP)}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_decreaseQty')}
        hitSlop={8}
        style={styles.hitArea}
      >
        <View style={styles.visualButton}>
          <MinusIcon size={14} color={color.leaf} />
        </View>
      </Pressable>
      <PriceText amount={amount} size="hero" />
      <Pressable
        onPress={() => onAdjust(STEP)}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_increaseQty')}
        hitSlop={8}
        style={styles.hitArea}
      >
        <View style={[styles.visualButton, styles.visualButtonActive]}>
          <PlusIcon size={14} color={color.paper} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.pill,
    paddingVertical: 8,
  },
  hitArea: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  visualButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualButtonActive: { backgroundColor: color.leaf },
});

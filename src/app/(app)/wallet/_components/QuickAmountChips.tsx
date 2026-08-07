import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { formatRwf } from '@/lib';

const AMOUNTS = [50000, 100000, 200000, 500000];

export interface QuickAmountChipsProps {
  selected: number;
  onSelect: (amount: number) => void;
}

export function QuickAmountChips({ selected, onSelect }: QuickAmountChipsProps) {
  return (
    <View style={styles.row}>
      {AMOUNTS.map((amount) => {
        const active = amount === selected;
        return (
          <Pressable
            key={amount}
            onPress={() => onSelect(amount)}
            accessibilityRole="button"
            accessibilityLabel={formatRwf(amount)}
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{formatRwf(amount)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  chip: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: color.tintLeaf, borderColor: color.leaf },
  label: { ...text.label, color: color.secondary, fontVariant: ['tabular-nums'] },
  labelActive: { color: color.leaf },
});

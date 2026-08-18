import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';

const AMOUNTS = [50000, 100000, 200000, 500000];

export interface QuickAmountChipsProps {
  selected: number;
  onSelect: (amount: number) => void;
}

export function QuickAmountChips({ selected, onSelect }: QuickAmountChipsProps) {
  const { colors } = useTheme();

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
            style={[
              styles.chip,
              { backgroundColor: colors.paper, borderColor: colors.hairline },
              active && { backgroundColor: colors.tintLeaf, borderColor: colors.leaf },
            ]}
          >
            <Text style={[styles.label, { color: colors.secondary }, active && { color: colors.leaf }]}>
              {formatRwf(amount)}
            </Text>
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label, fontVariant: ['tabular-nums'] },
});

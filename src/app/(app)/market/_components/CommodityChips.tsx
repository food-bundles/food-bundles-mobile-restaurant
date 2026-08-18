import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import type { CommodityId, CommodityInfo } from '@/mocks';

export interface CommodityChipsProps {
  options: CommodityInfo[];
  selected: CommodityId;
  onSelect: (id: CommodityId) => void;
}

/** Horizontal commodity picker driving the hero chart below it. */
export function CommodityChips({ options, selected, onSelect }: CommodityChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const active = option.id === selected;
        return (
          <Pressable
            key={option.id}
            onPress={() => onSelect(option.id)}
            accessibilityRole="button"
            accessibilityLabel={option.name}
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
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
  chipActive: { backgroundColor: color.leaf, borderColor: color.leaf },
  label: { ...text.label, color: color.secondary },
  labelActive: { color: color.paper },
});

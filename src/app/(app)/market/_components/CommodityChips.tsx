import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import type { CommodityId, CommodityInfo } from '@/mocks';

export interface CommodityChipsProps {
  options: CommodityInfo[];
  selected: CommodityId;
  onSelect: (id: CommodityId) => void;
}

/** Horizontal commodity picker driving the hero chart below it. */
export function CommodityChips({ options, selected, onSelect }: CommodityChipsProps) {
  const { colors } = useTheme();

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
            style={[
              styles.chip,
              { backgroundColor: colors.paper, borderColor: colors.hairline },
              active && { backgroundColor: colors.leaf, borderColor: colors.leaf },
            ]}
          >
            <Text style={[styles.label, { color: colors.secondary }, active && { color: colors.paper }]}>
              {option.name}
            </Text>
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label },
});

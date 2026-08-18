import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import type { TimeRange } from '@/mocks';

export interface TimeRangeTabsProps {
  options: TimeRange[];
  selected: TimeRange;
  onSelect: (range: TimeRange) => void;
}

/** Compact segmented control for the chart's history window. */
export function TimeRangeTabs({ options, selected, onSelect }: TimeRangeTabsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.neutral }]}>
      {options.map((option) => {
        const active = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityLabel={option}
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && { backgroundColor: colors.paper }]}
          >
            <Text style={[styles.label, { color: colors.secondary }, active && { color: colors.leaf }]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 2,
  },
  tab: {
    flex: 1,
    minHeight: hit.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: space.xs,
  },
  label: { ...text.label },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import type { TimeRange } from '@/mocks';

export interface TimeRangeTabsProps {
  options: TimeRange[];
  selected: TimeRange;
  onSelect: (range: TimeRange) => void;
}

/** Compact segmented control for the chart's history window. */
export function TimeRangeTabs({ options, selected, onSelect }: TimeRangeTabsProps) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityLabel={option}
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: color.neutral,
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
  tabActive: { backgroundColor: color.paper },
  label: { ...text.label, color: color.secondary },
  labelActive: { color: color.leaf },
});

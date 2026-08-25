import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';

export interface MultiSelectOption<T extends string> {
  key: T;
  label: string;
}

export interface MultiSelectChipsProps<T extends string> {
  options: MultiSelectOption<T>[];
  selected: T[];
  onToggle: (key: T) => void;
}

/** Horizontal row of chips where more than one option may be active at once. */
export function MultiSelectChips<T extends string>({ options, selected, onToggle }: MultiSelectChipsProps<T>) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const active = selected.includes(option.key);
        return (
          <Pressable
            key={option.key}
            onPress={() => onToggle(option.key)}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active }}
            style={[
              styles.chip,
              { backgroundColor: colors.paper, borderColor: colors.leaf },
              active && { backgroundColor: colors.leaf },
            ]}
          >
            <Text style={[styles.label, { color: colors.leaf }, active && { color: colors.paper }]}>
              {option.label}
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
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label },
});

import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';

export interface MarketTopTabOption<T extends string> {
  key: T;
  label: string;
}

export interface MarketTopTabSwitchProps<T extends string> {
  options: MarketTopTabOption<T>[];
  active: T;
  onSelect: (key: T) => void;
}

/** Horizontal top-level tab switch for the Market screen (Dashboard / Charts / My Price History). */
export function MarketTopTabSwitch<T extends string>({ options, active, onSelect }: MarketTopTabSwitchProps<T>) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const selected = option.key === active;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={[
              styles.chip,
              { backgroundColor: colors.paper, borderColor: colors.hairline },
              selected && { backgroundColor: colors.leaf, borderColor: colors.leaf },
            ]}
          >
            <Text style={[styles.label, { color: selected ? colors.paper : colors.ink }]}>{option.label}</Text>
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
  label: { ...text.bodySemi },
});

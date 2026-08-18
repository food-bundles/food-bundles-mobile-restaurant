import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, text, useTheme } from '@/theme';

export interface OptionRowOption<T extends string> {
  value: T;
  label: string;
}

export interface OptionRowProps<T extends string> {
  options: OptionRowOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export function OptionRow<T extends string>({ options, selected, onSelect }: OptionRowProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
            style={[
              styles.option,
              { borderColor: colors.hairline },
              active && { backgroundColor: colors.leaf, borderColor: colors.leaf },
            ]}
          >
            <Text style={[styles.label, { color: colors.secondary }, active && { color: colors.paper }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1,
    minHeight: hit.min,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  label: { ...text.label, textAlign: 'center' },
});

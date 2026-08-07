import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, text } from '@/theme';

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
            style={[styles.option, active && styles.optionActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
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
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  optionActive: { backgroundColor: color.leaf, borderColor: color.leaf },
  label: { ...text.label, color: color.secondary, textAlign: 'center' },
  labelActive: { color: color.paper },
});

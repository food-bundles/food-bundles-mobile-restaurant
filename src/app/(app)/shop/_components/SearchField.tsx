import { TextInput, StyleSheet, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { SearchIcon } from '@/components/icons';

export interface SearchFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}

export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.paper, borderColor: colors.leaf }]}>
      <SearchIcon color={colors.leaf} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={placeholder}
        autoFocus
        style={[styles.input, { color: colors.ink }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: hit.min,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  input: { ...text.body, flex: 1, paddingVertical: space.sm },
});

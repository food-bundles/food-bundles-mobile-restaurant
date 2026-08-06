import { TextInput, StyleSheet, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { SearchIcon } from '@/components/icons';

export interface SearchFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}

export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  return (
    <View style={styles.container}>
      <SearchIcon color={color.leaf} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.muted}
        accessibilityLabel={placeholder}
        autoFocus
        style={styles.input}
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
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.leaf,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  input: { ...text.body, color: color.ink, flex: 1, paddingVertical: space.sm },
});

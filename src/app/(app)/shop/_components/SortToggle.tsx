import { Pressable, StyleSheet, Text } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';

export type SortOrder = 'asc' | 'desc';

export interface SortToggleProps {
  sort: SortOrder;
  onToggle: () => void;
}

export function SortToggle({ sort, onToggle }: SortToggleProps) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={sort === 'asc' ? 'Sort by price, low to high' : 'Sort by price, high to low'}
      style={styles.button}
    >
      <Text style={styles.label}>{sort === 'asc' ? 'Price ↑' : 'Price ↓'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label, color: color.ink },
});

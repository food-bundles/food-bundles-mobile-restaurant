import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';

export interface Suggestion {
  key: string;
  label: string;
}

export interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {suggestions.map((suggestion) => (
        <Pressable
          key={suggestion.key}
          onPress={() => onSelect(suggestion)}
          accessibilityRole="button"
          accessibilityLabel={suggestion.label}
          style={[styles.chip, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
        >
          <Text style={[styles.label, { color: colors.leaf }]}>{suggestion.label}</Text>
        </Pressable>
      ))}
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

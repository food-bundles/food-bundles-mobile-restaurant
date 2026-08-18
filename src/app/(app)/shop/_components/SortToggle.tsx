import { Pressable, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export type SortOrder = 'asc' | 'desc';

export interface SortToggleProps {
  sort: SortOrder;
  onToggle: () => void;
}

export function SortToggle({ sort, onToggle }: SortToggleProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={sort === 'asc' ? t('a11y_sortLowToHigh') : t('a11y_sortHighToLow')}
      style={[styles.button, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
    >
      <Text style={[styles.label, { color: colors.ink }]}>{sort === 'asc' ? 'Price ↑' : 'Price ↓'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label },
});

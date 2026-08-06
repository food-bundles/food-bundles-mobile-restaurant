import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

export type OrderFilter = 'all' | 'active' | 'past';

const FILTER_KEY: Record<OrderFilter, TranslationKey> = {
  all: 'orders_filterAll',
  active: 'orders_filterActive',
  past: 'orders_filterPast',
};

export interface OrderFilterChipsProps {
  selected: OrderFilter;
  onSelect: (filter: OrderFilter) => void;
}

export function OrderFilterChips({ selected, onSelect }: OrderFilterChipsProps) {
  const t = useT();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {(['all', 'active', 'past'] as const).map((filter) => {
        const active = filter === selected;
        return (
          <Pressable
            key={filter}
            onPress={() => onSelect(filter)}
            accessibilityRole="button"
            accessibilityLabel={t(FILTER_KEY[filter])}
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{t(FILTER_KEY[filter])}</Text>
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
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: color.leaf, borderColor: color.leaf },
  label: { ...text.label, color: color.secondary },
  labelActive: { color: color.paper },
});

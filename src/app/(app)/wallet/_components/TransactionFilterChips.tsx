import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

export type TransactionFilter = 'all' | 'TOP_UP' | 'PAYMENT' | 'REFUND';

const FILTER_KEY: Record<TransactionFilter, TranslationKey> = {
  all: 'wallet_filterAll',
  TOP_UP: 'wallet_filterTopUps',
  PAYMENT: 'wallet_filterPayments',
  REFUND: 'wallet_filterRefunds',
};

export interface TransactionFilterChipsProps {
  selected: TransactionFilter;
  onSelect: (filter: TransactionFilter) => void;
}

export function TransactionFilterChips({ selected, onSelect }: TransactionFilterChipsProps) {
  const t = useT();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {(['all', 'TOP_UP', 'PAYMENT', 'REFUND'] as const).map((filter) => {
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

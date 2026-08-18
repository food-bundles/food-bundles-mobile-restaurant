import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
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
  const { colors } = useTheme();

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
            style={[
              styles.chip,
              { backgroundColor: colors.paper, borderColor: colors.hairline },
              active && { backgroundColor: colors.leaf, borderColor: colors.leaf },
            ]}
          >
            <Text
              style={[styles.label, { color: colors.secondary }, active && { color: colors.paper }]}
            >
              {t(FILTER_KEY[filter])}
            </Text>
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
  label: { ...text.label },
});

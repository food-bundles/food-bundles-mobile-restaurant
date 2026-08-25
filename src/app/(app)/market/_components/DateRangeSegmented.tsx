import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, text, useTheme } from '@/theme';
import type { PriceHistoryRange } from '@/lib';
import { useT } from '@/i18n';

export interface DateRangeSegmentedProps {
  active: PriceHistoryRange;
  onSelect: (range: PriceHistoryRange) => void;
}

/** Segmented This week / This month / Last 3 months filter for the price-history screen. */
export function DateRangeSegmented({ active, onSelect }: DateRangeSegmentedProps) {
  const t = useT();
  const { colors } = useTheme();
  const options: { key: PriceHistoryRange; label: string }[] = [
    { key: 'WEEK', label: t('priceHistory_thisWeek') },
    { key: 'MONTH', label: t('priceHistory_thisMonth') },
    { key: 'QUARTER', label: t('priceHistory_last3Months') },
  ];

  return (
    <View style={[styles.track, { backgroundColor: colors.neutral }]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.key === active;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={[styles.segment, selected && { backgroundColor: colors.paper }]}
          >
            <Text style={[styles.label, { color: selected ? colors.leaf : colors.secondary }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.pill, padding: 3 },
  segment: { flex: 1, minHeight: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  label: { ...text.label },
});

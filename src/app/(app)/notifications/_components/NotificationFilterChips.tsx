import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import type { NotificationChannel } from '@/mocks/types';

export type NotificationFilter = 'all' | NotificationChannel;

export interface NotificationFilterChipsProps {
  options: { key: NotificationFilter; label: string }[];
  active: NotificationFilter;
  onSelect: (filter: NotificationFilter) => void;
}

/** Horizontal channel filter row: All / Orders / Wallet / Vouchers / Market / Alerts / System. */
export function NotificationFilterChips({ options, active, onSelect }: NotificationFilterChipsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const selected = option.key === active;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            style={[
              styles.chip,
              { backgroundColor: colors.paper, borderColor: colors.leaf },
              selected && { backgroundColor: colors.leaf },
            ]}
          >
            <Text style={[styles.label, { color: colors.leaf }, selected && { color: colors.paper }]}>
              {option.label}
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

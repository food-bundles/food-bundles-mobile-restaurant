import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { BillingCycle } from '@/mocks/types';

export interface BillingToggleProps {
  selected: BillingCycle;
  onSelect: (cycle: BillingCycle) => void;
}

export function BillingToggle({ selected, onSelect }: BillingToggleProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.neutral }]}>
      {(['MONTHLY', 'WEEKLY'] as const).map((cycle) => {
        const active = cycle === selected;
        return (
          <Pressable
            key={cycle}
            onPress={() => onSelect(cycle)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={cycle === 'MONTHLY' ? t('sub_billingMonthly') : t('sub_billingWeekly')}
            style={[styles.option, active && { backgroundColor: colors.paper }]}
          >
            <Text style={[styles.label, { color: colors.secondary }, active && { color: colors.ink }]}>
              {cycle === 'MONTHLY' ? t('sub_billingMonthly') : t('sub_billingWeekly')}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderRadius: radius.pill, padding: 3 },
  option: {
    flex: 1,
    minHeight: hit.min - 6,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label },
});

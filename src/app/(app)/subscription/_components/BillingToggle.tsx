import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, text } from '@/theme';
import { useT } from '@/i18n';
import type { BillingCycle } from '@/mocks/types';

export interface BillingToggleProps {
  selected: BillingCycle;
  onSelect: (cycle: BillingCycle) => void;
}

export function BillingToggle({ selected, onSelect }: BillingToggleProps) {
  const t = useT();

  return (
    <View style={styles.row}>
      {(['MONTHLY', 'WEEKLY'] as const).map((cycle) => {
        const active = cycle === selected;
        return (
          <Pressable
            key={cycle}
            onPress={() => onSelect(cycle)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={cycle === 'MONTHLY' ? t('sub_billingMonthly') : t('sub_billingWeekly')}
            style={[styles.option, active && styles.optionActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {cycle === 'MONTHLY' ? t('sub_billingMonthly') : t('sub_billingWeekly')}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', backgroundColor: color.neutral, borderRadius: radius.pill, padding: 3 },
  option: {
    flex: 1,
    minHeight: hit.min - 6,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: { backgroundColor: color.paper },
  label: { ...text.label, color: color.secondary },
  labelActive: { color: color.ink },
});

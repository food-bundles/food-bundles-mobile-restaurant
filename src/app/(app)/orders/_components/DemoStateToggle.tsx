import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import type { OrdersDemoState } from '@/stores';

const STATES: OrdersDemoState[] = ['live', 'loading', 'empty', 'error'];

export interface DemoStateToggleProps {
  selected: OrdersDemoState;
  onSelect: (state: OrdersDemoState) => void;
}

export function DemoStateToggle({ selected, onSelect }: DemoStateToggleProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {STATES.map((state) => {
        const active = state === selected;
        return (
          <Pressable
            key={state}
            onPress={() => onSelect(state)}
            accessibilityRole="button"
            accessibilityLabel={`Demo state: ${state}`}
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{state}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.xs },
  chip: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: color.neutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: color.pine },
  label: { ...text.micro, color: color.secondary, textTransform: 'uppercase' },
  labelActive: { color: color.paper },
});

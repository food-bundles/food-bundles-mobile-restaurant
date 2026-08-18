import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { OrdersDemoState } from '@/stores';

const STATES: OrdersDemoState[] = ['live', 'loading', 'empty', 'error'];

export interface DemoStateToggleProps {
  selected: OrdersDemoState;
  onSelect: (state: OrdersDemoState) => void;
}

export function DemoStateToggle({ selected, onSelect }: DemoStateToggleProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {STATES.map((state) => {
        const active = state === selected;
        return (
          <Pressable
            key={state}
            onPress={() => onSelect(state)}
            accessibilityRole="button"
            accessibilityLabel={t('a11y_demoState', { state })}
            accessibilityState={{ selected: active }}
            style={[
              styles.chip,
              { backgroundColor: active ? colors.pine : colors.neutral },
            ]}
          >
            <Text style={[styles.label, { color: active ? colors.paper : colors.secondary }]}>{state}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.micro, textTransform: 'uppercase' },
});

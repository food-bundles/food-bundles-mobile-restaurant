import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export type ChartType = 'LINE' | 'CANDLE';

export interface ChartTypeToggleProps {
  active: ChartType;
  onSelect: (type: ChartType) => void;
}

/** Segmented Line / Candle chart-type switch. */
export function ChartTypeToggle({ active, onSelect }: ChartTypeToggleProps) {
  const t = useT();
  const { colors } = useTheme();
  const options: { key: ChartType; label: string }[] = [
    { key: 'LINE', label: t('charts_lineType') },
    { key: 'CANDLE', label: t('charts_candleType') },
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

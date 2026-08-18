import { StyleSheet, View } from 'react-native';
import { radius, useTheme } from '@/theme';

export interface SparklineProps {
  values: number[];
}

const BAR_WIDTH = 4;
const MAX_HEIGHT = 20;

/** Tiny bar-chart trend indicator for a table row. */
export function Sparkline({ values }: SparklineProps) {
  const { colors } = useTheme();
  const max = Math.max(...values, 1);

  return (
    <View style={styles.row}>
      {values.map((value, index) => (
        <View
          key={index}
          style={[styles.bar, { backgroundColor: colors.leaf, height: Math.max(3, (value / max) * MAX_HEIGHT) }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: MAX_HEIGHT },
  bar: { width: BAR_WIDTH, borderRadius: radius.sm / 4 },
});

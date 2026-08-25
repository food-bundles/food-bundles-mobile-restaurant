import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { space, useTheme } from '@/theme';

export interface VolumeBarsProps {
  volumes: number[];
}

const BAR_HEIGHT = 36;

/** Grey volume bars below the main chart, proportional to daily order volume. */
export function VolumeBars({ volumes }: VolumeBarsProps) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - space.lg * 2 - space.lg * 2;
  const max = Math.max(...volumes, 1);

  return (
    <View style={[styles.row, { width: chartWidth, height: BAR_HEIGHT }]}>
      {volumes.map((volume, index) => (
        <View
          key={index}
          style={[styles.bar, { backgroundColor: colors.disabledLine, height: (volume / max) * BAR_HEIGHT }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  bar: { width: 10, borderRadius: 2 },
});

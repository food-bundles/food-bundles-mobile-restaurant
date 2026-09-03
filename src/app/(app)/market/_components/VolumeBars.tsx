import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { space, useTheme } from '@/theme';
import { guardSeries } from './chartMath';

export interface VolumeBarsProps {
  volumes: number[];
}

const SECTION_HEIGHT = 48;
const BAR_GAP = 4;
const BAR_RADIUS = 4;
const MIN_BAR_HEIGHT = 4;

/** Leaf-tinted volume bars below the main chart, proportional to daily order volume. */
export function VolumeBars({ volumes: rawVolumes }: VolumeBarsProps) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = windowWidth - space.lg * 2 - space.lg * 2;
  const volumes = guardSeries(rawVolumes);
  const max = Math.max(...volumes, 1);

  return (
    <View style={[styles.row, { width: chartWidth, height: SECTION_HEIGHT, gap: BAR_GAP }]}>
      {volumes.map((volume, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor: colors.leaf,
              opacity: 0.6,
              height: Math.max(MIN_BAR_HEIGHT, (volume / max) * SECTION_HEIGHT),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  bar: { flex: 1, borderTopLeftRadius: BAR_RADIUS, borderTopRightRadius: BAR_RADIUS },
});

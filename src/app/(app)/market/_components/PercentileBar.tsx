import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';

export interface PercentileBarProps {
  percentile: number;
}

/** A 1-100 percentile axis with a "You" marker positioned at the restaurant's rank. */
export function PercentileBar({ percentile }: PercentileBarProps) {
  const { colors } = useTheme();
  const clamped = Math.min(100, Math.max(0, percentile));

  return (
    <View style={styles.wrap}>
      <View style={[styles.track, { backgroundColor: colors.neutral }]}>
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: colors.tintLeaf }]} />
        <View style={[styles.marker, { left: `${clamped}%`, backgroundColor: colors.leaf }]} />
      </View>
      <View style={styles.labelsRow}>
        <Text style={[styles.axisLabel, { color: colors.secondary }]}>0</Text>
        <Text style={[styles.axisLabel, { color: colors.secondary }]}>100</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: space.sm },
  track: { height: 10, borderRadius: radius.pill, overflow: 'visible' },
  fill: { height: '100%', borderRadius: radius.pill },
  marker: {
    position: 'absolute',
    top: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
  },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs },
  axisLabel: { ...text.micro },
});

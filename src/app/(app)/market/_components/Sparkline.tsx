import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import { guardSeries } from './chartMath';

export interface SparklineProps {
  values: number[];
}

const WIDTH = 64;
const HEIGHT = 24;
const PADDING = 2;
const TENSION = 0.4;

/** Builds a smoothed (Catmull-Rom-style) cubic path through the given points. */
function buildCurvedPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + ((p2.x - p0.x) / 6) * TENSION * 3;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * TENSION * 3;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * TENSION * 3;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * TENSION * 3;

    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

/** Curved 7-point trend sparkline for a watchlist row, no fill. */
export function Sparkline({ values: rawValues }: SparklineProps) {
  const { colors } = useTheme();
  const values = guardSeries(rawValues);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const usableWidth = WIDTH - PADDING * 2;
  const usableHeight = HEIGHT - PADDING * 2;
  const step = usableWidth / (values.length - 1 || 1);

  const points = values.map((value, index) => ({
    x: PADDING + index * step,
    y: PADDING + usableHeight - ((value - min) / range) * usableHeight,
  }));

  return (
    <View style={styles.wrap}>
      <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Path
          d={buildCurvedPath(points)}
          stroke={colors.leaf}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: WIDTH, height: HEIGHT },
});

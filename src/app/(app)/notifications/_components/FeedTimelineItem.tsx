import { StyleSheet, Text, View } from 'react-native';
import { color, space, text } from '@/theme';

export interface FeedTimelineItemProps {
  title: string;
  subtitle: string;
  active?: boolean;
  isLast?: boolean;
}

export function FeedTimelineItem({ title, subtitle, active, isLast }: FeedTimelineItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, active && styles.dotActive]} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, active && styles.titleActive]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.md },
  rail: { alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: color.leaf },
  dotActive: { backgroundColor: color.marigold, width: 16, height: 16, borderRadius: 8 },
  line: { width: 2, flex: 1, minHeight: 26, backgroundColor: color.hairline },
  textCol: { paddingBottom: space.lg, flex: 1 },
  title: { ...text.bodySemi, color: color.ink },
  titleActive: { color: color.tintedAmberText },
  subtitle: { ...text.caption, color: color.secondary, marginTop: 2 },
});

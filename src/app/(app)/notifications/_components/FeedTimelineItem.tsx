import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';

export interface FeedTimelineItemProps {
  title: string;
  subtitle: string;
  active?: boolean;
  isLast?: boolean;
}

export function FeedTimelineItem({ title, subtitle, active, isLast }: FeedTimelineItemProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View
          style={[
            styles.dot,
            { backgroundColor: colors.leaf },
            active && [styles.dotActive, { backgroundColor: colors.marigold }],
          ]}
        />
        {!isLast ? <View style={[styles.line, { backgroundColor: colors.hairline }]} /> : null}
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: colors.ink }, active && { color: colors.tintedAmberText }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.md },
  rail: { alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7 },
  dotActive: { width: 16, height: 16, borderRadius: 8 },
  line: { width: 2, flex: 1, minHeight: 26 },
  textCol: { paddingBottom: space.lg, flex: 1 },
  title: { ...text.bodySemi },
  subtitle: { ...text.caption, marginTop: 2 },
});

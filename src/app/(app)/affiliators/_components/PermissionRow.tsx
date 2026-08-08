import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';

export interface PermissionRowProps {
  label: string;
  enabled: boolean;
  onToggle?: () => void;
  note?: string;
}

export function PermissionRow({ label, enabled, onToggle, note }: PermissionRowProps) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onToggle}
        disabled={!onToggle}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled, disabled: !onToggle }}
        accessibilityLabel={label}
        style={styles.row}
      >
        <Text style={[styles.label, !enabled && styles.labelMuted]}>{label}</Text>
        <View style={[styles.track, enabled && styles.trackOn]}>
          <View style={[styles.thumb, enabled && styles.thumbOn]} />
        </View>
      </Pressable>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: hit.min - 20 },
  label: { ...text.bodySemi, color: color.ink },
  labelMuted: { color: color.secondary },
  track: { width: 38, height: 22, borderRadius: 11, backgroundColor: color.disabledLine },
  trackOn: { backgroundColor: color.leaf },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: color.paper,
    marginTop: 2,
    marginLeft: 2,
  },
  thumbOn: { marginLeft: 18 },
  note: { ...text.caption, color: color.tintedAmberText, marginTop: space.sm },
});

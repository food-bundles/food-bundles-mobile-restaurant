import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';

export interface PermissionRowProps {
  label: string;
  enabled: boolean;
  onToggle?: () => void;
  note?: string;
}

export function PermissionRow({ label, enabled, onToggle, note }: PermissionRowProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <Pressable
        onPress={onToggle}
        disabled={!onToggle}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled, disabled: !onToggle }}
        accessibilityLabel={label}
        style={styles.row}
      >
        <Text style={[styles.label, { color: enabled ? colors.ink : colors.secondary }]}>{label}</Text>
        <View style={[styles.track, { backgroundColor: enabled ? colors.leaf : colors.disabledLine }]}>
          <View style={[styles.thumb, { backgroundColor: colors.paper }, enabled && styles.thumbOn]} />
        </View>
      </Pressable>
      {note ? <Text style={[styles.note, { color: colors.tintedAmberText }]}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: hit.min },
  label: { ...text.bodySemi },
  track: { width: 38, height: 22, borderRadius: 11 },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginTop: 2,
    marginLeft: 2,
  },
  thumbOn: { marginLeft: 18 },
  note: { ...text.caption, marginTop: space.sm },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { renderChannelIcon } from '@/components/notifications/channelIcon';
import type { NotificationChannel } from '@/mocks/types';

export interface ChannelToggleRowProps {
  channel: NotificationChannel;
  name: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  isLast?: boolean;
}

/** One notification-channel row: icon, name, description, and an on/off switch. */
export function ChannelToggleRow({ channel, name, description, enabled, onToggle, isLast }: ChannelToggleRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={name}
      style={[styles.row, !isLast && [styles.rowBorder, { borderBottomColor: colors.neutralLine }]]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]}>{renderChannelIcon(channel, colors.leaf)}</View>
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: colors.ink }]}>{name}</Text>
        <Text style={[styles.description, { color: colors.secondary }]}>{description}</Text>
      </View>
      <View style={[styles.track, { backgroundColor: enabled ? colors.leaf : colors.disabledLine }]}>
        <View style={[styles.thumb, { backgroundColor: colors.paper }, enabled && styles.thumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: hit.min + 8,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  rowBorder: { borderBottomWidth: 1 },
  iconWrap: { width: 36, height: 36, borderRadius: radius.sm + 1, alignItems: 'center', justifyContent: 'center' },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  description: { ...text.caption, marginTop: 2 },
  track: { width: 38, height: 22, borderRadius: 11 },
  thumb: { width: 18, height: 18, borderRadius: 9, marginTop: 2, marginLeft: 2 },
  thumbOn: { marginLeft: 18 },
});

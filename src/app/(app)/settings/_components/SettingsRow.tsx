import { Pressable, StyleSheet, Text } from 'react-native';
import { color, hit, space, text } from '@/theme';
import { ChevronRightIcon } from '@/components/icons';

export interface SettingsRowProps {
  label: string;
  trailing?: React.ReactNode;
  onPress: () => void;
  isLast?: boolean;
  destructive?: boolean;
}

export function SettingsRow({ label, trailing, onPress, isLast, destructive }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.row, !isLast && styles.rowBorder]}
    >
      <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
      {trailing}
      {!destructive ? <ChevronRightIcon /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: hit.min + 2,
    paddingHorizontal: space.md,
    justifyContent: 'space-between',
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: color.neutralLine },
  label: { ...text.body, color: color.ink, flex: 1 },
  labelDestructive: { color: color.chili, fontFamily: text.bodySemi.fontFamily },
});

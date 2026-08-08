import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { ChevronRightIcon } from '@/components/icons';

export interface MoreMenuRowProps {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  onPress: () => void;
  isLast?: boolean;
}

export function MoreMenuRow({ icon, label, trailing, onPress, isLast }: MoreMenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.row, !isLast && styles.rowBorder]}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
      {trailing}
      <ChevronRightIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: hit.min + 14,
    paddingHorizontal: space.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: color.neutralLine },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm + 1,
    backgroundColor: color.tintLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.body, color: color.ink, flex: 1 },
});

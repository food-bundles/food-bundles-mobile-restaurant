import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ChevronRightIcon } from '@/components/icons';

export interface MoreMenuRowProps {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  onPress: () => void;
  isLast?: boolean;
}

export function MoreMenuRow({ icon, label, trailing, onPress, isLast }: MoreMenuRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.row, !isLast && [styles.rowBorder, { borderBottomColor: colors.neutralLine }]]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]}>{icon}</View>
      <Text style={[styles.label, { color: colors.ink }]}>{label}</Text>
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
  rowBorder: { borderBottomWidth: 1 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm + 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.body, flex: 1 },
});

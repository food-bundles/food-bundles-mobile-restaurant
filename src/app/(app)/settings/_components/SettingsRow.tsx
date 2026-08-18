import { Pressable, StyleSheet, Text } from 'react-native';
import { hit, space, text, useTheme } from '@/theme';
import { ChevronRightIcon } from '@/components/icons';

export interface SettingsRowProps {
  label: string;
  trailing?: React.ReactNode;
  onPress: () => void;
  isLast?: boolean;
  destructive?: boolean;
}

export function SettingsRow({ label, trailing, onPress, isLast, destructive }: SettingsRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.row, !isLast && [styles.rowBorder, { borderBottomColor: colors.neutralLine }]]}
    >
      <Text
        style={[
          styles.label,
          { color: colors.ink },
          destructive && { color: colors.chili, fontFamily: text.bodySemi.fontFamily },
        ]}
      >
        {label}
      </Text>
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
  rowBorder: { borderBottomWidth: 1 },
  label: { ...text.body, flex: 1 },
});

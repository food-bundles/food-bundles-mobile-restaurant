import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface MaOverlayToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

/** Small on/off switch for the 7-day moving-average overlay. */
export function MaOverlayToggle({ enabled, onToggle }: MaOverlayToggleProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={t('charts_movingAverageToggle')}
      style={styles.row}
    >
      <Text style={[styles.label, { color: colors.ink }]}>{t('charts_movingAverageToggle')}</Text>
      <View style={[styles.track, { backgroundColor: enabled ? colors.marigold : colors.disabledLine }]}>
        <View style={[styles.thumb, { backgroundColor: colors.paper }, enabled && styles.thumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: hit.min,
    marginTop: space.sm,
  },
  label: { ...text.label },
  track: { width: 38, height: 22, borderRadius: 11 },
  thumb: { width: 18, height: 18, borderRadius: 9, marginTop: 2, marginLeft: 2 },
  thumbOn: { marginLeft: 18 },
});

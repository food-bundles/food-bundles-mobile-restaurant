import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface FirstTimeToggleRowProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

/** Single toggle row for "First time using vouchers?" — a leaf switch, no yes/no button pair. */
export function FirstTimeToggleRow({ value, onChange }: FirstTimeToggleRowProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.ink }]}>{t('underwriting_firstTime')}</Text>
      <Pressable
        onPress={() => onChange(!value)}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={t('underwriting_firstTime')}
        style={styles.switchHit}
      >
        <View style={[styles.track, { backgroundColor: value ? colors.leaf : colors.disabledLine }]}>
          <View style={[styles.thumb, { backgroundColor: colors.paper }, value && styles.thumbOn]} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { ...text.label, flex: 1 },
  switchHit: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  track: { width: 38, height: 22, borderRadius: 11 },
  thumb: { width: 18, height: 18, borderRadius: 9, marginTop: 2, marginLeft: 2 },
  thumbOn: { marginLeft: 18 },
});

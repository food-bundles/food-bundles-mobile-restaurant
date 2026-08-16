import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, text } from '@/theme';
import { useT } from '@/i18n';

export type WalletPane = 'topup' | 'vouchers';

export interface WalletTabSwitchProps {
  active: WalletPane;
  onSelect: (pane: WalletPane) => void;
}

export function WalletTabSwitch({ active, onSelect }: WalletTabSwitchProps) {
  const t = useT();
  const options: { key: WalletPane; label: string }[] = [
    { key: 'topup', label: t('wallet_topUp') },
    { key: 'vouchers', label: t('vouchers_title') },
  ];

  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.key === active;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={[styles.segment, selected && styles.segmentActive]}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: color.neutral,
    borderRadius: radius.pill,
    padding: 3,
  },
  segment: {
    flex: 1,
    minHeight: hit.min,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: color.paper },
  label: { ...text.label, color: color.secondary },
  labelActive: { color: color.leaf },
});

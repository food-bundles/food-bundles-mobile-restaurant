import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export type WalletPane = 'topup' | 'vouchers';

export interface WalletTabSwitchProps {
  active: WalletPane;
  onSelect: (pane: WalletPane) => void;
}

export function WalletTabSwitch({ active, onSelect }: WalletTabSwitchProps) {
  const t = useT();
  const { colors } = useTheme();
  const options: { key: WalletPane; label: string }[] = [
    { key: 'topup', label: t('wallet_topUp') },
    { key: 'vouchers', label: t('vouchers_title') },
  ];

  return (
    <View style={[styles.track, { backgroundColor: colors.neutral }]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.key === active;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={[styles.segment, selected && { backgroundColor: colors.paper }]}
          >
            <Text style={[styles.label, { color: selected ? colors.leaf : colors.secondary }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
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
  label: { ...text.label },
});

import { TextInput, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { formatRwfNumber } from '@/lib';

export interface TopupAmountInputProps {
  amount: number;
  onChangeAmount: (amount: number) => void;
}

export function TopupAmountInput({ amount, onChangeAmount }: TopupAmountInputProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.label, { color: colors.ink }]}>{t('wallet_amountLabel')}</Text>
      <View style={[styles.row, { borderColor: colors.leaf }]}>
        <TextInput
          value={formatRwfNumber(amount)}
          onChangeText={(next) => onChangeAmount(parseInt(next.replace(/[^0-9]/g, ''), 10) || 0)}
          keyboardType="number-pad"
          accessibilityLabel={t('wallet_amountLabel')}
          style={[styles.input, { color: colors.ink }]}
        />
        <Text style={[styles.suffix, { color: colors.secondary }]}>RWF</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...text.label, marginBottom: space.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    minHeight: 56,
  },
  input: { ...text.priceHero, flex: 1, fontVariant: ['tabular-nums'] },
  suffix: { ...text.bodySemi },
});

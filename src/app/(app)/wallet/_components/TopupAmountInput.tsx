import { TextInput, StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export interface TopupAmountInputProps {
  amount: number;
  onChangeAmount: (amount: number) => void;
}

export function TopupAmountInput({ amount, onChangeAmount }: TopupAmountInputProps) {
  const t = useT();

  return (
    <View>
      <Text style={styles.label}>{t('wallet_amountLabel')}</Text>
      <View style={styles.row}>
        <TextInput
          value={amount.toLocaleString('en-US')}
          onChangeText={(next) => onChangeAmount(parseInt(next.replace(/[^0-9]/g, ''), 10) || 0)}
          keyboardType="number-pad"
          accessibilityLabel={t('wallet_amountLabel')}
          style={styles.input}
        />
        <Text style={styles.suffix}>RWF</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...text.label, color: color.ink, marginBottom: space.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1.5,
    borderColor: color.leaf,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    minHeight: 56,
  },
  input: { ...text.priceHero, color: color.ink, flex: 1, fontVariant: ['tabular-nums'] },
  suffix: { ...text.bodySemi, color: color.secondary },
});

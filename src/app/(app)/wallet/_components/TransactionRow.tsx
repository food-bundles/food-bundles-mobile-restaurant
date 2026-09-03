import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { WalletIcon } from '@/components/icons';
import { PriceText } from '@/components/product';
import { formatDate } from '@/lib';
import type { Transaction } from '@/mocks/types';

export interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const { colors } = useTheme();
  const content = (
    <View style={[styles.row, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.neutral }]}>
        <WalletIcon size={18} color={colors.leaf} />
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.label, { color: colors.ink }]}>{transaction.note}</Text>
        <Text style={[styles.date, { color: colors.secondary }]}>{formatDate(transaction.date)}</Text>
      </View>
      <PriceText
        amount={Math.abs(transaction.amount)}
        size="md"
        colorOverride={transaction.amount < 0 ? colors.chili : colors.ripe}
      />
    </View>
  );

  if (!transaction.orderId) return content;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/(app)/orders/[id]', params: { id: transaction.orderId! } })}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.note}, opens order ${transaction.orderId}`}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  label: { ...text.bodySemi },
  date: { ...text.caption, marginTop: 2 },
});

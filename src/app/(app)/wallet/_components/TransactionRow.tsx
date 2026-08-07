import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { WalletIcon } from '@/components/icons';
import { PriceText } from '@/components/product';
import { formatDate } from '@/lib';
import type { Transaction } from '@/mocks/types';

export interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const content = (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <WalletIcon size={18} color={color.leaf} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.label}>{transaction.note}</Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
      <PriceText
        amount={Math.abs(transaction.amount)}
        size="md"
        colorOverride={transaction.amount < 0 ? color.chili : color.ripe}
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
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: color.neutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  label: { ...text.bodySemi, color: color.ink },
  date: { ...text.caption, color: color.secondary, marginTop: 2 },
});

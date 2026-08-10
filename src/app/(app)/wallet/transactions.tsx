import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { color, space } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { WalletIcon } from '@/components/icons';
import { EmptyState } from '@/components/primitives';
import { TransactionRow } from './_components/TransactionRow';
import { TransactionFilterChips, type TransactionFilter } from './_components/TransactionFilterChips';
import { useWalletStore } from '@/stores';
import { useT } from '@/i18n';

export default function Transactions() {
  const t = useT();
  const transactions = useWalletStore((state) => state.transactions);
  const fetch = useWalletStore((state) => state.fetch);
  const [filter, setFilter] = useState<TransactionFilter>('all');

  useEffect(() => {
    if (transactions.length === 0) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((t2) => t2.type === filter)),
    [transactions, filter],
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('wallet_transactions')} />
      <ScreenScroll contentInsetBottom={40}>
        <View style={styles.filterGap}>
          <TransactionFilterChips selected={filter} onSelect={setFilter} />
        </View>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<WalletIcon size={22} color={color.leaf} />}
            title={t('wallet_emptyTitle')}
            message={t('wallet_emptyMessage')}
          />
        ) : (
          <View style={styles.listGap}>
            {filtered.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </View>
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  filterGap: { marginTop: space.md, marginBottom: space.sm },
  listGap: { marginTop: space.sm },
});

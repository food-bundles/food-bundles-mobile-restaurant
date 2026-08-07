import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon, WalletIcon } from '@/components/icons';
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
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('wallet_transactions')}</Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink },
  filterGap: { marginTop: space.md, marginBottom: space.sm },
  listGap: { marginTop: space.sm },
});

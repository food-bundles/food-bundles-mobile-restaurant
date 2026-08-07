import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, SectionHeader } from '@/components/layout';
import { PriceText } from '@/components/product';
import { TransactionRow } from '../wallet/_components/TransactionRow';
import { useWalletStore } from '@/stores';
import { useT } from '@/i18n';

export default function WalletBalance() {
  const t = useT();
  const balance = useWalletStore((state) => state.balance);
  const transactions = useWalletStore((state) => state.transactions);
  const fetch = useWalletStore((state) => state.fetch);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenScroll>
      <Text style={styles.title}>{t('wallet_title')}</Text>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>{t('wallet_availableBalance')}</Text>
        <PriceText amount={balance} size="hero" colorOverride={color.paper} />
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => router.push('/(app)/wallet/top-up')}
            accessibilityRole="button"
            accessibilityLabel={t('wallet_topUp')}
            style={styles.topUpButton}
          >
            <Text style={styles.topUpLabel}>{t('wallet_topUp')}</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(app)/wallet/transactions')}
            accessibilityRole="button"
            accessibilityLabel={t('wallet_history')}
            style={styles.historyButton}
          >
            <View style={styles.historyBackdrop} />
            <Text style={styles.historyLabel}>{t('wallet_history')}</Text>
          </Pressable>
        </View>
      </View>
      <SectionHeader
        title={t('wallet_recentActivity')}
        action={
          <Pressable
            onPress={() => router.push('/(app)/wallet/transactions')}
            accessibilityRole="button"
            accessibilityLabel={t('wallet_seeAll')}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllLabel}>{t('wallet_seeAll')}</Text>
          </Pressable>
        }
      />
      <View style={styles.listGap}>
        {transactions.slice(0, 3).map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h1, color: color.ink, marginTop: space.sm },
  balanceCard: {
    backgroundColor: color.pine,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.md,
  },
  balanceLabel: { ...text.caption, color: color.onPine },
  actionRow: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  topUpButton: {
    flex: 1,
    minHeight: 44,
    backgroundColor: color.marigold,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topUpLabel: { ...text.bodySemi, color: color.pine },
  historyButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  historyBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.paper,
    opacity: 0.12,
  },
  historyLabel: { ...text.bodySemi, color: color.paper },
  seeAllButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  seeAllLabel: { ...text.label, color: color.leaf },
  listGap: { marginTop: space.sm },
});

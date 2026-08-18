import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, SectionHeader } from '@/components/layout';
import { PriceText } from '@/components/product';
import { TransactionRow } from '../wallet/_components/TransactionRow';
import { WalletTabSwitch, type WalletPane } from './_components/WalletTabSwitch';
import { VouchersActive } from './_components/VouchersActive';
import { VouchersLocked } from './_components/VouchersLocked';
import { useWalletStore, useSessionStore, isVouchersUnlocked } from '@/stores';
import { useT } from '@/i18n';

export default function WalletBalance() {
  const t = useT();
  const { colors } = useTheme();
  const { tab } = useLocalSearchParams<{ tab?: WalletPane }>();
  const [pane, setPane] = useState<WalletPane>(tab === 'vouchers' ? 'vouchers' : 'topup');
  const balance = useWalletStore((state) => state.balance);
  const transactions = useWalletStore((state) => state.transactions);
  const fetch = useWalletStore((state) => state.fetch);
  const tier = useSessionStore((state) => state.tier);
  const unlocked = isVouchersUnlocked(tier);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === 'vouchers' || tab === 'topup') setPane(tab);
  }, [tab]);

  return (
    <ScreenScroll>
      <Text style={[styles.title, { color: colors.ink }]}>{t('wallet_title')}</Text>
      <View style={styles.switchGap}>
        <WalletTabSwitch active={pane} onSelect={setPane} />
      </View>
      {pane === 'topup' ? (
        <View style={styles.paneGap}>
          <View style={[styles.balanceCard, { backgroundColor: colors.pine }]}>
            <Text style={[styles.balanceLabel, { color: colors.onPine }]}>{t('wallet_availableBalance')}</Text>
            <PriceText amount={balance} size="hero" colorOverride={colors.paper} />
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => router.push('/(app)/wallet/top-up')}
                accessibilityRole="button"
                accessibilityLabel={t('wallet_topUp')}
                style={[styles.topUpButton, { backgroundColor: colors.marigold }]}
              >
                <Text style={[styles.topUpLabel, { color: colors.pine }]}>{t('wallet_topUp')}</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/(app)/wallet/transactions')}
                accessibilityRole="button"
                accessibilityLabel={t('wallet_history')}
                style={styles.historyButton}
              >
                <View style={[styles.historyBackdrop, { backgroundColor: colors.paper }]} />
                <Text style={[styles.historyLabel, { color: colors.paper }]}>{t('wallet_history')}</Text>
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
                <Text style={[styles.seeAllLabel, { color: colors.leaf }]}>{t('wallet_seeAll')}</Text>
              </Pressable>
            }
          />
          <View style={styles.listGap}>
            {transactions.slice(0, 3).map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.paneGap}>{unlocked ? <VouchersActive /> : <VouchersLocked />}</View>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h1, marginTop: space.sm },
  switchGap: { marginTop: space.md },
  paneGap: { marginTop: space.md },
  balanceCard: {
    borderRadius: radius.lg,
    padding: space.lg,
  },
  balanceLabel: { ...text.caption },
  actionRow: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  topUpButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topUpLabel: { ...text.bodySemi },
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
    opacity: 0.12,
  },
  historyLabel: { ...text.bodySemi },
  seeAllButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  seeAllLabel: { ...text.label },
  listGap: { marginTop: space.sm },
});

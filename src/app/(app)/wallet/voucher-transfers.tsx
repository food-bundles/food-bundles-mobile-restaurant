import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { EmptyState } from '@/components/primitives';
import { WalletIcon } from '@/components/icons';
import { useWalletStore } from '@/stores';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib';

const SOURCE_LABEL: Record<string, string> = {
  VOUCHER_EXPIRY: 'Voucher expiry credit',
  LOAN_APPROVAL: 'Loan approval credit',
};

export default function VoucherTransfers() {
  const t = useT();
  const { colors } = useTheme();
  const voucherTransfers = useWalletStore((s) => s.voucherTransfers);
  const fetchVoucherTransfers = useWalletStore((s) => s.fetchVoucherTransfers);
  const status = useWalletStore((s) => s.status);

  useEffect(() => {
    fetchVoucherTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sourceLabel = (source: string) =>
    SOURCE_LABEL[source?.toUpperCase()] ?? source ?? t('wallet_voucherCredit');

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('wallet_voucherCreditsTitle')} />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.intro, { color: colors.secondary }]}>
          {t('wallet_voucherCreditsIntro')}
        </Text>

        {status === 'loading' && voucherTransfers.length === 0 ? (
          <ActivityIndicator color={colors.leaf} style={styles.loader} />
        ) : voucherTransfers.length === 0 ? (
          <EmptyState
            icon={<WalletIcon size={22} color={colors.leaf} />}
            title={t('wallet_voucherCreditsEmpty')}
            message={t('wallet_voucherCreditsEmptyMessage')}
          />
        ) : (
          <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            {voucherTransfers.map((transfer, idx) => (
              <View key={transfer.id}>
                {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.hairline }]} />}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={[styles.amount, { color: colors.leaf }]}>
                      +{formatRwf(transfer.amount)}
                    </Text>
                    <Text style={[styles.source, { color: colors.ink }]}>
                      {sourceLabel(transfer.source)}
                    </Text>
                    {transfer.notes ? (
                      <Text style={[styles.notes, { color: colors.secondary }]} numberOfLines={2}>
                        {transfer.notes}
                      </Text>
                    ) : null}
                    <Text style={[styles.date, { color: colors.muted }]}>
                      {new Date(transfer.transferredAt ?? transfer.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.leaf + '20', borderColor: colors.leaf + '40' }]}>
                    <Text style={[styles.badgeText, { color: colors.leaf }]}>
                      {transfer.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.caption, marginTop: space.sm, marginBottom: space.md },
  loader: { marginTop: space.xl },
  card: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  divider: { height: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: space.md },
  rowLeft: { flex: 1, gap: 2 },
  amount: { ...text.bodySemi },
  source: { ...text.body },
  notes: { ...text.caption },
  date: { ...text.micro, marginTop: 2 },
  badge: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3, marginLeft: space.sm },
  badgeText: { ...text.micro, fontWeight: '600' },
});

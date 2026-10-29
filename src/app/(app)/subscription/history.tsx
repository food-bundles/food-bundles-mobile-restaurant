import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { useSubscriptionsStore } from '@/stores';
import { useT } from '@/i18n';

const ACTION_LABELS: Record<string, string> = {
  CREATED: 'Subscribed',
  RENEWED: 'Renewed',
  UPGRADED: 'Upgraded',
  DOWNGRADED: 'Downgraded',
  CANCELLED: 'Cancelled',
  SUSPENDED: 'Suspended',
  EXPIRED: 'Expired',
  REACTIVATED: 'Reactivated',
  ROLLBACK: 'Payment rolled back',
  LOAN_ACCESS_REQUESTED: 'Loan access requested',
  LOAN_ACCESS_APPROVED: 'Loan access approved',
  LOAN_ACCESS_REJECTED: 'Loan access rejected',
  LOAN_ACCESS_DISABLED: 'Loan access disabled',
  LOAN_ACCESS_ENABLED: 'Loan access enabled',
};

function statusColor(action: string, colors: any) {
  if (['CREATED', 'RENEWED', 'UPGRADED', 'REACTIVATED', 'LOAN_ACCESS_APPROVED', 'LOAN_ACCESS_ENABLED'].includes(action))
    return colors.tintedGreenText ?? colors.leaf;
  if (['CANCELLED', 'EXPIRED', 'ROLLBACK', 'LOAN_ACCESS_REJECTED', 'LOAN_ACCESS_DISABLED'].includes(action))
    return colors.chili;
  return colors.secondary;
}

export default function SubscriptionHistory() {
  const t = useT();
  const { colors } = useTheme();
  const history = useSubscriptionsStore((s) => s.history);
  const fetchHistory = useSubscriptionsStore((s) => s.fetchHistory);
  const status = useSubscriptionsStore((s) => s.status);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('sub_historyTitle')} />
      <ScreenScroll contentInsetBottom={40}>
        {status === 'loading' && history.length === 0 ? (
          <ActivityIndicator color={colors.leaf} style={styles.loader} />
        ) : history.length === 0 ? (
          <Text style={[styles.empty, { color: colors.secondary }]}>{t('sub_historyEmpty')}</Text>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            {history.map((entry, idx) => (
              <View key={entry.id}>
                {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.hairline }]} />}
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={[styles.action, { color: statusColor(entry.action, colors) }]}>
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </Text>
                    {entry.reason ? (
                      <Text style={[styles.reason, { color: colors.secondary }]}>{entry.reason}</Text>
                    ) : null}
                    {entry.newStatus ? (
                      <Text style={[styles.statusChange, { color: colors.muted }]}>
                        {entry.oldStatus ? `${entry.oldStatus} → ` : ''}{entry.newStatus}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={[styles.date, { color: colors.muted }]}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </Text>
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
  loader: { marginTop: space.xl },
  empty: { ...text.body, textAlign: 'center', marginTop: space.xl },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    marginTop: space.md,
    overflow: 'hidden',
  },
  divider: { height: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: space.md,
    gap: space.sm,
  },
  rowLeft: { flex: 1, gap: 2 },
  action: { ...text.bodySemi },
  reason: { ...text.caption },
  statusChange: { ...text.micro },
  date: { ...text.micro, paddingTop: 2 },
});

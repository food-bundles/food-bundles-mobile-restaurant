import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { formatRwf } from '@/lib';
import { getLoanSessionsApi, type LoanSession } from '@/api/voucher-card.api';

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: 'Pending',
  APPROVED_LOCKED: 'Approved (Locked)',
  UNLOCK_FEE_PENDING: 'Unlock Fee Due',
  ACTIVE: 'Active',
  PARTIALLY_USED: 'Partially Used',
  FULLY_USED: 'Fully Used',
  SETTLED: 'Settled',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
  OVERDUE: 'Overdue',
};

const STATUS_COLOR: Record<string, string> = {
  REQUESTED: '#f59e0b',
  APPROVED_LOCKED: '#3b82f6',
  UNLOCK_FEE_PENDING: '#f97316',
  ACTIVE: '#22c55e',
  PARTIALLY_USED: '#10b981',
  FULLY_USED: '#6b7280',
  SETTLED: '#8b5cf6',
  CLOSED: '#6b7280',
  REJECTED: '#ef4444',
  OVERDUE: '#dc2626',
};

function SessionCard({ session }: { session: LoanSession }) {
  const { colors } = useTheme();
  const statusColor = STATUS_COLOR[session.status] ?? colors.secondary;
  const canPay = session.status === 'APPROVED_LOCKED' || session.status === 'UNLOCK_FEE_PENDING';

  return (
    <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardRrn, { color: colors.secondary }]}>RRN: {session.rrn}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>
            {STATUS_LABEL[session.status] ?? session.status}
          </Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <Text style={[styles.cardKey, { color: colors.secondary }]}>Requested</Text>
        <Text style={[styles.cardVal, { color: colors.ink }]}>{formatRwf(session.requestedAmount)}</Text>
      </View>
      {session.approvedAmount ? (
        <View style={styles.cardRow}>
          <Text style={[styles.cardKey, { color: colors.secondary }]}>Approved</Text>
          <Text style={[styles.cardVal, { color: colors.ink }]}>{formatRwf(session.approvedAmount)}</Text>
        </View>
      ) : null}
      <View style={styles.cardRow}>
        <Text style={[styles.cardKey, { color: colors.secondary }]}>Outstanding</Text>
        <Text style={[styles.cardVal, { color: colors.ink }]}>{formatRwf(session.outstandingAmount)}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={[styles.cardKey, { color: colors.secondary }]}>Repayment</Text>
        <Text style={[styles.cardVal, { color: colors.ink }]}>{session.repaymentDays} days</Text>
      </View>
      {session.dueDate ? (
        <View style={styles.cardRow}>
          <Text style={[styles.cardKey, { color: colors.secondary }]}>Due Date</Text>
          <Text style={[styles.cardVal, { color: session.status === 'OVERDUE' ? '#dc2626' : colors.ink }]}>
            {new Date(session.dueDate).toLocaleDateString()}
          </Text>
        </View>
      ) : null}
      {canPay ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/(app)/vouchers/unlock-fee',
              params: { sessionId: session.id, unlockFee: String(session.unlockFee ?? 0) },
            })
          }
          style={[styles.payBtn, { backgroundColor: '#f97316' }]}
        >
          <Text style={styles.payBtnLabel}>Pay Unlock Fee — {formatRwf(session.unlockFee ?? 0)}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function LoanSessionsHistory() {
  const { colors } = useTheme();
  const [sessions, setSessions] = useState<LoanSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    setLoading(true);
    setError(null);
    try {
      const data = await getLoanSessionsApi();
      setSessions(data);
    } catch {
      setError('Could not load loan history. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Loan History" />
      <ScreenScroll contentInsetBottom={40}>
        {loading ? (
          <ActivityIndicator color={colors.leaf} style={styles.center} />
        ) : error ? (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text>
            <Pressable onPress={fetchSessions} style={[styles.retryBtn, { backgroundColor: colors.leaf }]}>
              <Text style={[styles.retryBtnLabel, { color: colors.paper }]}>Retry</Text>
            </Pressable>
          </View>
        ) : sessions.length === 0 ? (
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: colors.secondary }]}>No loan history yet.</Text>
          </View>
        ) : (
          sessions.map((s) => <SessionCard key={s.id} session={s} />)
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { paddingTop: 60, alignItems: 'center' },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.md,
    marginBottom: space.md,
    gap: space.xs,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm },
  cardRrn: { ...text.micro },
  badge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 2 },
  badgeText: { ...text.micro, fontWeight: '600' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardKey: { ...text.caption },
  cardVal: { ...text.bodySemi },
  payBtn: {
    minHeight: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  payBtnLabel: { ...text.label, color: '#fff', fontWeight: '600' },
  retryBtn: { minHeight: 44, borderRadius: radius.md, paddingHorizontal: space.lg, alignItems: 'center', justifyContent: 'center', marginTop: space.sm },
  retryBtnLabel: { ...text.bodySemi },
  errorText: { ...text.body, textAlign: 'center' },
  emptyText: { ...text.body, textAlign: 'center' },
});

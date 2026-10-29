import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib';
import { request } from '@/api/client';

type DepositStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';

interface DepositRequest {
  id: string;
  amount: number;
  reason?: string;
  status: DepositStatus;
  createdAt: string;
  resolvedAt?: string;
}

const STATUS_COLORS: Record<DepositStatus, string> = {
  PENDING: '#F59E0B',
  APPROVED: '#10B981',
  REJECTED: '#EF4444',
  REFUNDED: '#6366F1',
};

function StatusBadge({ status }: { status: DepositStatus }) {
  const color = STATUS_COLORS[status] ?? '#6B7280';
  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color + '40' }]}>
      <Text style={[styles.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

export default function DepositRequests() {
  const t = useT();
  const { colors } = useTheme();
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await request<{ data: DepositRequest[] }>('/wallets/deposit-requests');
      setRequests(res.data);
    } catch {
      // no deposits yet — ok
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit() {
    const amtNum = Number(amount);
    if (!amtNum || amtNum < 1000 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await request('/wallets/deposit-requests', {
        method: 'POST',
        body: { amount: amtNum, reason: reason.trim() || undefined },
      });
      setAmount('');
      setReason('');
      await fetchRequests();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Deposit Requests" />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.intro, { color: colors.secondary }]}>
          Request a security deposit refund or submit a new deposit request to Food Bundles.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <Text style={[styles.cardTitle, { color: colors.ink }]}>New Request</Text>
          <Input
            label="Amount (RWF)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="number-pad"
            placeholder="e.g. 50000"
          />
          <Input
            label="Reason (optional)"
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Security deposit for new agreement"
          />
          {error ? (
            <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text>
          ) : null}
          <Pressable
            onPress={onSubmit}
            disabled={!amount || Number(amount) < 1000 || submitting}
            accessibilityRole="button"
            style={[
              styles.submitBtn,
              { backgroundColor: colors.leaf },
              (!amount || Number(amount) < 1000 || submitting) && styles.btnDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.paper} />
            ) : (
              <Text style={[styles.submitLabel, { color: colors.paper }]}>Submit Request</Text>
            )}
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.leaf} style={styles.loader} />
        ) : requests.length === 0 ? (
          <Text style={[styles.empty, { color: colors.secondary }]}>No deposit requests yet.</Text>
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>HISTORY</Text>
            <View style={[styles.historyCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
              {requests.map((req, idx) => (
                <View key={req.id}>
                  {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.hairline }]} />}
                  <View style={styles.reqRow}>
                    <View style={styles.reqLeft}>
                      <Text style={[styles.reqAmount, { color: colors.ink }]}>{formatRwf(req.amount)}</Text>
                      {req.reason ? (
                        <Text style={[styles.reqReason, { color: colors.secondary }]} numberOfLines={1}>
                          {req.reason}
                        </Text>
                      ) : null}
                      <Text style={[styles.reqDate, { color: colors.muted }]}>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <StatusBadge status={req.status} />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.caption, marginTop: space.sm, marginBottom: space.md },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.md, gap: space.md },
  cardTitle: { ...text.bodySemi },
  errorText: { ...text.caption },
  submitBtn: { minHeight: hit.min, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.5 },
  submitLabel: { ...text.bodySemi },
  loader: { marginTop: space.xl },
  empty: { ...text.body, textAlign: 'center', marginTop: space.xl },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  historyCard: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  divider: { height: 1 },
  reqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: space.md },
  reqLeft: { flex: 1, gap: 2 },
  reqAmount: { ...text.bodySemi },
  reqReason: { ...text.caption },
  reqDate: { ...text.micro, marginTop: 2 },
  badge: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  badgeText: { ...text.micro, fontWeight: '600' },
});

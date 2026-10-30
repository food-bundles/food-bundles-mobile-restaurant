import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenHeader } from '@/components/layout';
import { formatRwf } from '@/lib';
import {
  getVoucherCardApi,
  requestVoucherCardApi,
  type VoucherCard,
} from '@/api/voucher-card.api';

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

function maskPan(pan: string) {
  return pan.replace(/(.{4})/g, '$1 ').trim().replace(/\d(?=.{5})/g, '•');
}

function CardDisplay({ card }: { card: VoucherCard }) {
  const masked = maskPan(card.pan);
  return (
    <View style={[styles.card, { backgroundColor: '#1a5c38' }]}>
      <Text style={styles.cardLabel}>FOODBUNDLES VOUCHER CARD</Text>
      <Text style={styles.cardPan}>{masked}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardSub}>{card.status}</Text>
        <Text style={styles.cardSub}>Limit: {formatRwf(card.loanLimit)}</Text>
      </View>
    </View>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: colors.secondary }]}>{label}</Text>
      <Text style={[styles.statVal, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

export default function VoucherCardScreen() {
  const { colors } = useTheme();
  const [card, setCard] = useState<VoucherCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentDone, setEnrollmentDone] = useState(false);

  useEffect(() => {
    fetchCard();
  }, []);

  async function fetchCard() {
    setLoading(true);
    setError(null);
    try {
      const data = await getVoucherCardApi();
      setCard(data);
    } catch {
      setError('Could not load your voucher card. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestEnrollment() {
    setRequesting(true);
    setError(null);
    try {
      await requestVoucherCardApi();
      setEnrollmentDone(true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to submit enrollment request.');
    } finally {
      setRequesting(false);
    }
  }

  const session = card?.activeLoanSession;

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Voucher Card" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator color={colors.leaf} style={styles.center} />
        ) : error ? (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text>
            <Pressable onPress={fetchCard} style={[styles.btn, { backgroundColor: colors.leaf }]}>
              <Text style={[styles.btnLabel, { color: colors.paper }]}>Retry</Text>
            </Pressable>
          </View>
        ) : card === null ? (
          <View style={styles.emptyWrap}>
            {enrollmentDone ? (
              <>
                <Text style={[styles.emptyTitle, { color: colors.ink }]}>Enrollment Submitted</Text>
                <Text style={[styles.emptySub, { color: colors.secondary }]}>
                  Your voucher card enrollment is under review. We will notify you once it is approved.
                </Text>
                <Pressable
                  onPress={() => router.push('/(app)/vouchers/kyc')}
                  style={[styles.btn, { backgroundColor: colors.leaf }]}
                >
                  <Text style={[styles.btnLabel, { color: colors.paper }]}>Complete KYC</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={[styles.emptyTitle, { color: colors.ink }]}>No Voucher Card Yet</Text>
                <Text style={[styles.emptySub, { color: colors.secondary }]}>
                  Apply for a FoodBundles voucher card to access short-term business loans. You will need to
                  complete KYC first.
                </Text>
                <Pressable
                  onPress={() => router.push('/(app)/vouchers/kyc')}
                  style={[styles.btn, { backgroundColor: colors.leaf }]}
                >
                  <Text style={[styles.btnLabel, { color: colors.paper }]}>Complete KYC First</Text>
                </Pressable>
                <Pressable
                  onPress={handleRequestEnrollment}
                  disabled={requesting}
                  style={[styles.outlineBtn, { borderColor: colors.leaf }]}
                >
                  {requesting ? (
                    <ActivityIndicator color={colors.leaf} />
                  ) : (
                    <Text style={[styles.outlineBtnLabel, { color: colors.leaf }]}>Request Card</Text>
                  )}
                </Pressable>
              </>
            )}
          </View>
        ) : (
          <>
            <CardDisplay card={card} />

            <View style={[styles.statsCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
              <StatRow label="Outstanding Loans" value={formatRwf(card.totalOutstandingLoans)} />
              <StatRow label="Total Loans Received" value={String(card.totalLoansReceived)} />
              <StatRow label="Qualifying Orders" value={String(card.qualifyingOrders)} />
              <StatRow label="Eligibility" value={card.isEligible ? 'Eligible' : 'Not eligible'} />
              {card.eligibilityReason ? (
                <Text style={[styles.eligibilityNote, { color: colors.secondary }]}>
                  {card.eligibilityReason}
                </Text>
              ) : null}
            </View>

            {session ? (
              <View style={[styles.sessionCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                <View style={styles.sessionHeader}>
                  <Text style={[styles.sessionTitle, { color: colors.ink }]}>Active Loan</Text>
                  <View style={[styles.badge, { backgroundColor: STATUS_COLOR[session.status] + '22' }]}>
                    <Text style={[styles.badgeText, { color: STATUS_COLOR[session.status] }]}>
                      {session.status.replace(/_/g, ' ')}
                    </Text>
                  </View>
                </View>
                <StatRow label="Requested" value={formatRwf(session.requestedAmount)} />
                {session.approvedAmount ? (
                  <StatRow label="Approved" value={formatRwf(session.approvedAmount)} />
                ) : null}
                <StatRow label="Outstanding" value={formatRwf(session.outstandingAmount)} />
                {session.unlockFee ? (
                  <StatRow label="Unlock Fee" value={formatRwf(session.unlockFee)} />
                ) : null}
                {(session.status === 'APPROVED_LOCKED' || session.status === 'UNLOCK_FEE_PENDING') ? (
                  <Pressable
                    onPress={() => router.push({
                      pathname: '/(app)/vouchers/unlock-fee',
                      params: { sessionId: session.id, unlockFee: String(session.unlockFee ?? 0) },
                    })}
                    style={[styles.btn, { backgroundColor: '#f97316', marginTop: space.md }]}
                  >
                    <Text style={[styles.btnLabel, { color: '#fff' }]}>Pay Unlock Fee</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : card.isEligible ? (
              <Pressable
                onPress={() => router.push('/(app)/vouchers/loan-session-request')}
                style={[styles.btn, { backgroundColor: colors.leaf, marginTop: space.md }]}
              >
                <Text style={[styles.btnLabel, { color: colors.paper }]}>Request a Loan</Text>
              </Pressable>
            ) : null}

            <Pressable
              onPress={() => router.push('/(app)/vouchers/loan-sessions-history')}
              style={[styles.outlineBtn, { borderColor: colors.leaf, marginTop: space.sm }]}
            >
              <Text style={[styles.outlineBtnLabel, { color: colors.leaf }]}>View All Loan History</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: space.md, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  card: {
    borderRadius: radius.lg,
    padding: space.lg,
    marginBottom: space.md,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' },
  cardPan: { color: '#fff', fontSize: 20, fontWeight: '600', letterSpacing: 4, marginTop: space.md },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.md },
  cardSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  statsCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.md,
    marginBottom: space.md,
    gap: space.sm,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { ...text.caption },
  statVal: { ...text.bodySemi },
  eligibilityNote: { ...text.micro, marginTop: space.xs },
  sessionCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.md,
    marginBottom: space.md,
    gap: space.sm,
  },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm },
  sessionTitle: { ...text.h2 },
  badge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 2 },
  badgeText: { ...text.micro, fontWeight: '600' },
  btn: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  btnLabel: { ...text.bodySemi },
  outlineBtn: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingHorizontal: space.lg,
  },
  outlineBtnLabel: { ...text.bodySemi },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: space.md },
  emptyTitle: { ...text.h2, textAlign: 'center' },
  emptySub: { ...text.body, textAlign: 'center', lineHeight: 22 },
  errorText: { ...text.body, textAlign: 'center', marginBottom: space.md },
});

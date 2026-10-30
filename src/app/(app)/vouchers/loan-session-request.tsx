import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { formatRwf } from '@/lib';
import {
  getLoanTermsApi,
  acceptLoanTermsApi,
  requestLoanSessionApi,
  type LoanTerms,
} from '@/api/voucher-card.api';

const AMOUNT_OPTIONS = [50_000, 100_000, 200_000, 500_000];
const REPAYMENT_DAYS = [7, 14, 30];

export default function LoanSessionRequest() {
  const { colors } = useTheme();
  const [step, setStep] = useState<'amount' | 'terms' | 'done'>('amount');
  const [amount, setAmount] = useState(AMOUNT_OPTIONS[0]);
  const [days, setDays] = useState(14);
  const [purpose, setPurpose] = useState('');
  const [providerType] = useState<'FOOD_BUNDLES'>('FOOD_BUNDLES');

  const [terms, setTerms] = useState<LoanTerms | null>(null);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [tcVisible, setTcVisible] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (step === 'terms') fetchTerms();
  }, [step]);

  async function fetchTerms() {
    setLoadingTerms(true);
    setTermsError(null);
    try {
      const data = await getLoanTermsApi(providerType);
      setTerms(data);
    } catch {
      setTermsError('Could not load loan terms. Please try again.');
    } finally {
      setLoadingTerms(false);
    }
  }

  async function handleAcceptAndRequest() {
    if (!terms) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (!terms.accepted) {
        await acceptLoanTermsApi({
          providerType: terms.providerType,
          providerId: terms.providerId,
          providerName: terms.providerName,
        });
      }
      const session = await requestLoanSessionApi({
        requestedAmount: amount,
        repaymentDays: days,
        purpose: purpose || undefined,
        loanProviderType: providerType,
      });
      setSessionId(session.id);
      setStep('done');
    } catch (e: any) {
      setSubmitError(e?.message ?? 'Failed to submit loan request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'done') {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title="Loan Request" />
        <View style={styles.successWrap}>
          <Text style={[styles.successTitle, { color: colors.ink }]}>Request Submitted</Text>
          <Text style={[styles.successSub, { color: colors.secondary }]}>
            Your loan request of {formatRwf(amount)} has been submitted. You will be notified once approved.
          </Text>
          <Pressable
            onPress={() => router.replace('/(app)/vouchers/voucher-card')}
            style={[styles.btn, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.btnLabel, { color: colors.paper }]}>View Card</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (step === 'terms') {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title="Terms & Conditions" />
        {loadingTerms ? (
          <ActivityIndicator color={colors.leaf} style={styles.center} />
        ) : termsError ? (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: colors.chili }]}>{termsError}</Text>
            <Pressable onPress={fetchTerms} style={[styles.btn, { backgroundColor: colors.leaf }]}>
              <Text style={[styles.btnLabel, { color: colors.paper }]}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: space.md, paddingBottom: 40 }}>
            <View style={[styles.summaryCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryKey, { color: colors.secondary }]}>Amount</Text>
                <Text style={[styles.summaryVal, { color: colors.ink }]}>{formatRwf(amount)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryKey, { color: colors.secondary }]}>Repayment</Text>
                <Text style={[styles.summaryVal, { color: colors.ink }]}>{days} days</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryKey, { color: colors.secondary }]}>Provider</Text>
                <Text style={[styles.summaryVal, { color: colors.ink }]}>{terms?.providerName ?? 'Food Bundles'}</Text>
              </View>
            </View>

            <Pressable onPress={() => setTcVisible(true)} style={styles.tcLink}>
              <Text style={[styles.tcLinkText, { color: colors.leaf }]}>
                {terms?.accepted ? '✓ You have accepted the T&C' : 'Read Terms & Conditions →'}
              </Text>
            </Pressable>

            {submitError ? (
              <Text style={[styles.errorText, { color: colors.chili }]}>{submitError}</Text>
            ) : null}

            <Pressable
              onPress={handleAcceptAndRequest}
              disabled={submitting}
              style={[styles.btn, { backgroundColor: colors.leaf }, submitting && styles.disabled]}
            >
              {submitting ? (
                <ActivityIndicator color={colors.paper} />
              ) : (
                <Text style={[styles.btnLabel, { color: colors.paper }]}>
                  {terms?.accepted ? 'Submit Request' : 'Accept & Submit'}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => setStep('amount')} style={styles.backBtn}>
              <Text style={[styles.backBtnLabel, { color: colors.secondary }]}>← Back</Text>
            </Pressable>
          </ScrollView>
        )}

        <Modal visible={tcVisible} animationType="slide" onRequestClose={() => setTcVisible(false)}>
          <View style={[styles.modalContainer, { backgroundColor: colors.oat }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.ink }]}>Terms & Conditions</Text>
              <Pressable onPress={() => setTcVisible(false)} style={styles.closeBtn}>
                <Text style={[styles.closeBtnText, { color: colors.secondary }]}>Close</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: space.md }}>
              <Text style={[styles.tcText, { color: colors.ink }]}>
                {terms?.terms || 'By accepting these terms, you agree to repay the loan amount within the agreed repayment period. Late payments may incur penalties. Food Bundles reserves the right to adjust loan terms.'}
              </Text>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Request a Loan" />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.intro, { color: colors.secondary }]}>
          Request a short-term business loan using your voucher card. No interest charged.
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>LOAN AMOUNT</Text>
        <View style={styles.optionRow}>
          {AMOUNT_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => setAmount(opt)}
              style={[
                styles.tile,
                { borderColor: amount === opt ? colors.leaf : colors.hairline },
                amount === opt && { backgroundColor: colors.tintLeaf },
              ]}
            >
              <Text style={[styles.tileLabel, { color: amount === opt ? colors.pine : colors.ink }]}>
                {formatRwf(opt)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>REPAYMENT PERIOD</Text>
        <View style={styles.daysRow}>
          {REPAYMENT_DAYS.map((d) => (
            <Pressable
              key={d}
              onPress={() => setDays(d)}
              style={[
                styles.dayTile,
                { borderColor: days === d ? colors.leaf : colors.hairline },
                days === d && { backgroundColor: colors.tintLeaf },
              ]}
            >
              <Text style={[styles.tileLabel, { color: days === d ? colors.pine : colors.ink }]}>{d} days</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>PURPOSE (OPTIONAL)</Text>
        <Input
          label="Purpose"
          value={purpose}
          onChangeText={setPurpose}
          placeholder="e.g. Stock for upcoming event"
        />

        <Pressable
          onPress={() => setStep('terms')}
          style={[styles.btn, { backgroundColor: colors.leaf, marginTop: space.lg }]}
        >
          <Text style={[styles.btnLabel, { color: colors.paper }]}>Continue</Text>
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  intro: { ...text.caption, marginTop: space.sm, marginBottom: space.md },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tile: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    minWidth: '45%',
    alignItems: 'center',
  },
  tileLabel: { ...text.bodySemi },
  daysRow: { flexDirection: 'row', gap: space.sm },
  dayTile: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    minHeight: hit.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: space.md,
    gap: space.sm,
    marginBottom: space.md,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryKey: { ...text.caption },
  summaryVal: { ...text.bodySemi },
  tcLink: { minHeight: 44, justifyContent: 'center', marginBottom: space.sm },
  tcLinkText: { ...text.label },
  btn: { minHeight: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  btnLabel: { ...text.bodySemi },
  disabled: { opacity: 0.5 },
  errorText: { ...text.caption, textAlign: 'center', marginBottom: space.sm },
  backBtn: { minHeight: 44, justifyContent: 'center', alignItems: 'center', marginTop: space.sm },
  backBtnLabel: { ...text.label },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.md },
  successTitle: { ...text.h2, textAlign: 'center' },
  successSub: { ...text.body, textAlign: 'center', lineHeight: 22 },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: space.md,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: { ...text.h2 },
  closeBtn: { minHeight: 44, justifyContent: 'center' },
  closeBtnText: { ...text.label },
  tcText: { ...text.body, lineHeight: 24 },
});

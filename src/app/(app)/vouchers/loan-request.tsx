import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { useVouchersStore, useSessionStore } from '@/stores';
import { formatRwf } from '@/lib';

const LOAN_OPTIONS_RWF = [50_000, 100_000, 200_000, 500_000];
const REPAYMENT_DAYS = [7, 14, 30];

export default function LoanRequest() {
  const { colors } = useTheme();
  const tier = useSessionStore((s) => s.tier);
  const requestVoucher = useVouchersStore((s) => s.requestVoucher);

  const [amount, setAmount] = useState(LOAN_OPTIONS_RWF[0]);
  const [days, setDays] = useState(14);
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPaidTier = tier !== 'BASIC';

  async function onSubmit() {
    if (submitting || submitted) return;
    setSubmitting(true);
    setError(null);
    try {
      await requestVoucher(amount);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit loan request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title="Loan Request" />
        <View style={styles.successWrap}>
          <View style={[styles.successIcon, { backgroundColor: colors.tintLeaf }]}>
            <Text style={styles.successEmoji}>✓</Text>
          </View>
          <Text style={[styles.successTitle, { color: colors.ink }]}>Request Submitted</Text>
          <Text style={[styles.successSub, { color: colors.secondary }]}>
            Your loan request of {formatRwf(amount)} has been submitted. You will be notified once it is reviewed.
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.doneBtn, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.doneBtnLabel, { color: colors.paper }]}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!isPaidTier) {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title="Loan Request" />
        <View style={styles.successWrap}>
          <Text style={[styles.successTitle, { color: colors.ink }]}>Paid Subscription Required</Text>
          <Text style={[styles.successSub, { color: colors.secondary }]}>
            Direct loan requests are available to Standard and Premium subscribers. Upgrade your plan to access this feature.
          </Text>
          <Pressable
            onPress={() => router.push('/(app)/subscription/plans')}
            style={[styles.doneBtn, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.doneBtnLabel, { color: colors.paper }]}>View Plans</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Loan Request" />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.intro, { color: colors.secondary }]}>
          Request a short-term loan to cover your next Food Bundles order. Repay within the agreed period.
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>LOAN AMOUNT</Text>
        <View style={styles.optionRow}>
          {LOAN_OPTIONS_RWF.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => setAmount(opt)}
              style={[
                styles.amountTile,
                { borderColor: amount === opt ? colors.leaf : colors.hairline },
                amount === opt && { backgroundColor: colors.tintLeaf },
              ]}
            >
              <Text style={[styles.amountLabel, { color: amount === opt ? colors.pine : colors.ink }]}>
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
              <Text style={[styles.dayLabel, { color: days === d ? colors.pine : colors.ink }]}>{d} days</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>PURPOSE</Text>
        <Input
          label="Purpose (optional)"
          value={purpose}
          onChangeText={setPurpose}
          placeholder="e.g. Stock for upcoming event"
        />

        <View style={[styles.summaryCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryKey, { color: colors.secondary }]}>Loan amount</Text>
            <Text style={[styles.summaryVal, { color: colors.ink }]}>{formatRwf(amount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryKey, { color: colors.secondary }]}>Repayment period</Text>
            <Text style={[styles.summaryVal, { color: colors.ink }]}>{days} days</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryKey, { color: colors.secondary }]}>Interest</Text>
            <Text style={[styles.summaryVal, { color: colors.leaf }]}>0% (no interest)</Text>
          </View>
        </View>

        {error ? <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text> : null}

        <Pressable
          onPress={onSubmit}
          disabled={submitting}
          style={[styles.submitBtn, { backgroundColor: colors.leaf }, submitting && styles.btnDisabled]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Text style={[styles.submitLabel, { color: colors.paper }]}>Submit Request</Text>
          )}
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.caption, marginTop: space.sm, marginBottom: space.md },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  amountTile: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    minWidth: '45%',
    alignItems: 'center',
  },
  amountLabel: { ...text.bodySemi },
  daysRow: { flexDirection: 'row', gap: space.sm },
  dayTile: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    minHeight: hit.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: { ...text.bodySemi },
  summaryCard: { borderWidth: 1, borderRadius: radius.lg, padding: space.md, gap: space.sm, marginTop: space.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryKey: { ...text.caption },
  summaryVal: { ...text.bodySemi },
  errorText: { ...text.caption, textAlign: 'center', marginTop: space.sm, color: 'red' },
  submitBtn: { minHeight: hit.min, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: space.md },
  btnDisabled: { opacity: 0.5 },
  submitLabel: { ...text.bodySemi },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.md },
  successIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  successEmoji: { fontSize: 28 },
  successTitle: { ...text.h2, textAlign: 'center' },
  successSub: { ...text.body, textAlign: 'center', lineHeight: 22 },
  doneBtn: { minHeight: hit.min, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  doneBtnLabel: { ...text.bodySemi },
});

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { BillingToggle } from './_components/BillingToggle';
import { PlanSelectCard } from './_components/PlanSelectCard';
import { useSubscriptionsStore, useSessionStore } from '@/stores';
import { useT } from '@/i18n';
import type { BillingCycle, Tier } from '@/types';
import type { SubscribeResult } from '@/api/subscriptions.api';

type Stage = 'plans' | 'momo_pending' | 'card_redirect';

const POLL_INTERVAL_MS = 5000;
const POLL_MAX = 36;

export default function Plans() {
  const t = useT();
  const { colors } = useTheme();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [stage, setStage] = useState<Stage>('plans');
  const [pendingTxRef, setPendingTxRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [, setPollCount] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const termsAccepted = useSessionStore((state) => state.termsAccepted);
  const plans = useSubscriptionsStore((s) => s.plans);
  const fetchPlans = useSubscriptionsStore((s) => s.fetchPlans);
  const status = useSubscriptionsStore((s) => s.status);
  const current = useSubscriptionsStore((s) => s.current);
  const subscribe = useSubscriptionsStore((s) => s.subscribe);
  const changePlan = useSubscriptionsStore((s) => s.changePlan);
  const verifyPayment = useSubscriptionsStore((s) => s.verifyPayment);

  useEffect(() => {
    if (status === 'idle') fetchPlans();
  }, [status, fetchPlans]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const pollVerify = useCallback(async (txRef: string, count: number) => {
    if (count >= POLL_MAX) {
      stopPolling();
      setVerifying(false);
      Alert.alert(t('sub_paymentPending'), t('sub_paymentPendingNote'));
      return;
    }
    setVerifying(true);
    try {
      const result = await verifyPayment(txRef);
      if (result.verified) {
        stopPolling();
        setVerifying(false);
        setStage('plans');
        Alert.alert(t('sub_paymentSuccess'), t('sub_subscriptionActive'));
        return;
      }
    } catch {
      // continue polling
    }
    const nextCount = count + 1;
    setPollCount(nextCount);
    pollRef.current = setTimeout(() => pollVerify(txRef, nextCount), POLL_INTERVAL_MS);
  }, [stopPolling, verifyPayment, t]);

  const startPolling = useCallback((txRef: string) => {
    stopPolling();
    setPollCount(0);
    pollRef.current = setTimeout(() => pollVerify(txRef, 0), POLL_INTERVAL_MS);
  }, [stopPolling, pollVerify]);

  const handleResult = useCallback((result: SubscribeResult) => {
    if (!result.requiresPolling || result.status === 'successful') {
      setStage('plans');
      router.replace('/(app)/subscription/current');
      return;
    }
    const txRef = result.txRef ?? null;
    setPendingTxRef(txRef);

    if (result.redirectUrl) {
      Linking.openURL(result.redirectUrl).catch(() => {});
      setStage('card_redirect');
    } else {
      setStage('momo_pending');
    }

    if (txRef) startPolling(txRef);
  }, [startPolling]);

  const onChoosePlan = async (tier: Exclude<Tier, 'NONE'>) => {
    if (!termsAccepted) {
      router.push({ pathname: '/(app)/subscription/terms', params: { tier } });
      return;
    }
    const plan = plans.find((p) => p.id === tier);
    if (!plan) return;

    // Use the real DB UUID if available, otherwise fall back to the tier string
    const planId = plan.dbId ?? tier;

    setSubmitting(true);
    try {
      let result: SubscribeResult;
      if (current?.status === 'ACTIVE' && current.plan.id !== tier) {
        result = await changePlan(planId);
      } else {
        result = await subscribe(planId, 'MOBILE_MONEY');
      }
      handleResult(result);
    } catch (err: any) {
      Alert.alert(t('sub_paymentFailed'), err?.message ?? t('sub_tryAgain'));
    } finally {
      setSubmitting(false);
    }
  };

  const onCheckNow = async () => {
    if (!pendingTxRef) return;
    setVerifying(true);
    stopPolling();
    try {
      const result = await verifyPayment(pendingTxRef);
      if (result.verified) {
        setStage('plans');
        setVerifying(false);
        Alert.alert(t('sub_paymentSuccess'), t('sub_subscriptionActive'));
      } else {
        Alert.alert(t('sub_notYet'), t('sub_notYetNote'));
        startPolling(pendingTxRef);
      }
    } catch {
      Alert.alert(t('sub_verifyFailed'), t('sub_tryAgain'));
      startPolling(pendingTxRef);
    } finally {
      setVerifying(false);
    }
  };

  if (stage === 'momo_pending' || stage === 'card_redirect') {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title={t('sub_paymentPendingTitle')} />
        <View style={styles.pendingCenter}>
          <ActivityIndicator size="large" color={colors.leaf} style={styles.spinner} />
          <Text style={[styles.pendingTitle, { color: colors.ink }]}>
            {stage === 'card_redirect' ? t('sub_cardRedirectTitle') : t('sub_momoConfirmTitle')}
          </Text>
          <Text style={[styles.pendingBody, { color: colors.secondary }]}>
            {stage === 'card_redirect' ? t('sub_cardRedirectBody') : t('sub_momoConfirmBody')}
          </Text>
          <Pressable
            onPress={onCheckNow}
            disabled={verifying}
            accessibilityRole="button"
            style={[styles.checkBtn, { backgroundColor: colors.leaf }, verifying && styles.btnDisabled]}
          >
            {verifying
              ? <ActivityIndicator color={colors.paper} />
              : <Text style={[styles.checkBtnLabel, { color: colors.paper }]}>{t('sub_checkPayment')}</Text>}
          </Pressable>
          <Pressable
            onPress={() => { stopPolling(); setStage('plans'); }}
            accessibilityRole="button"
            style={styles.cancelLink}
          >
            <Text style={[styles.cancelLinkLabel, { color: colors.secondary }]}>{t('sub_backToPlans')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('sub_plans')} />
      <ScreenScroll contentInsetBottom={40}>
        <View style={styles.toggleGap}>
          <BillingToggle selected={billingCycle} onSelect={setBillingCycle} />
        </View>
        {status === 'loading' && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.leaf} />
          </View>
        )}
        {status === 'error' && plans.length === 0 && (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: colors.chili }]}>{t('sub_loadError')}</Text>
            <Pressable onPress={() => { useSubscriptionsStore.setState({ status: 'idle' }); fetchPlans(); }} accessibilityRole="button" style={[styles.retryBtn, { backgroundColor: colors.leaf }]}>
              <Text style={[styles.retryLabel, { color: colors.paper }]}>{t('sub_retry')}</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.cardsGap}>
          {plans.map((plan) => (
            <PlanSelectCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              onChoose={() => onChoosePlan(plan.id)}
              isActive={current?.status === 'ACTIVE' && current.plan.id === plan.id}
              disabled={submitting}
            />
          ))}
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toggleGap: { marginTop: space.md },
  cardsGap: { gap: space.md, marginTop: space.md },
  pendingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.md },
  centered: { alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.md },
  errorText: { ...text.body, textAlign: 'center' },
  retryBtn: { minHeight: hit.min, borderRadius: radius.md, paddingHorizontal: space.xl, alignItems: 'center', justifyContent: 'center' },
  retryLabel: { ...text.bodySemi },
  spinner: { marginBottom: space.sm },
  pendingTitle: { ...text.h1, textAlign: 'center' },
  pendingBody: { ...text.body, textAlign: 'center', maxWidth: 280 },
  checkBtn: { minHeight: hit.min, borderRadius: radius.md, paddingHorizontal: space.xl, alignItems: 'center', justifyContent: 'center', marginTop: space.sm },
  checkBtnLabel: { ...text.bodySemi },
  btnDisabled: { opacity: 0.5 },
  cancelLink: { marginTop: space.sm, padding: space.sm },
  cancelLinkLabel: { ...text.caption, textDecorationLine: 'underline' },
});

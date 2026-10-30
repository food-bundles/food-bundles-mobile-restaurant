import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { radius, space, text, useTheme } from "@/theme";
import { ScreenScroll, StickyFooter, ScreenHeader } from "@/components/layout";
import { MobileMoneyTile, CardTile } from "@/components/payment";
import { TopupAmountInput } from "./_components/TopupAmountInput";
import { QuickAmountChips } from "./_components/QuickAmountChips";
import { ShareAccountantRow } from "./_components/ShareAccountantRow";
import { ActionSheet } from "./_components/ActionSheet";
import { useWalletStore, useSessionStore } from "@/stores";
import { scheduleLocalNotification } from "@/services/notificationService";
import { useT, translate } from "@/i18n";
import { formatRwf } from "@/lib";

type Stage = 'form' | 'momo_pending' | 'card_redirect';

/** Top-up screen: pick an amount and a payment method, then confirm to add it to the wallet balance. */
export default function TopUp() {
  const t = useT();
  const { colors } = useTheme();
  const topUp = useWalletStore((state) => state.topUp);
  const verifyTopUp = useWalletStore((state) => state.verifyTopUp);
  const profilePhone = useSessionStore((state) => state.profile?.phone);
  const [amount, setAmount] = useState(200000);
  const [method, setMethod] = useState<"MOBILE_MONEY" | "CARD">("MOBILE_MONEY");
  const [phone, setPhone] = useState(profilePhone ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<Stage>('form');
  const [pendingTxId, setPendingTxId] = useState<string>('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [openSheet, setOpenSheet] = useState<"share" | "accountant" | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const startPolling = useCallback((txId: string) => {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts += 1;
      if (attempts > 36) { stopPolling(); return; }
      try {
        const res = await verifyTopUp(txId);
        if (res.verified) {
          stopPolling();
          await scheduleLocalNotification({
            channel: "wallet",
            title: translate("notif_walletToppedUp", { amount: formatRwf(amount) }),
            body: translate("notif_walletToppedUpBody"),
            deepLink: "/(app)/(tabs)/wallet",
          });
          router.back();
        }
      } catch { /* silent — keep polling */ }
    }, 5000);
  }, [amount, verifyTopUp, stopPolling]);

  const onCheckStatus = async () => {
    if (!pendingTxId || verifying) return;
    setVerifying(true);
    setVerifyError(null);
    try {
      const res = await verifyTopUp(pendingTxId);
      if (res.verified) {
        stopPolling();
        router.back();
      } else {
        setVerifyError(res.message ?? t('wallet_paymentNotConfirmed'));
      }
    } catch {
      setVerifyError(t('wallet_verifyFailed'));
    } finally {
      setVerifying(false);
    }
  };

  const onConfirm = async () => {
    setSubmitting(true);
    try {
      const result = await topUp(amount, method, phone || undefined);
      if (method === 'CARD' && result.redirectUrl) {
        setPendingTxId(result.transactionId);
        setStage('card_redirect');
        await Linking.openURL(result.redirectUrl);
        startPolling(result.transactionId);
      } else if (method === 'MOBILE_MONEY') {
        if (result.transactionId) {
          setPendingTxId(result.transactionId);
          setStage('momo_pending');
          startPolling(result.transactionId);
        } else {
          await scheduleLocalNotification({
            channel: "wallet",
            title: translate("notif_walletToppedUp", { amount: formatRwf(amount) }),
            body: translate("notif_walletToppedUpBody"),
            deepLink: "/(app)/(tabs)/wallet",
          });
          router.back();
        }
      } else {
        router.back();
      }
    } catch {
      // error handled inside topUp
    } finally {
      setSubmitting(false);
    }
  };

  if (stage === 'momo_pending' || stage === 'card_redirect') {
    const isMomo = stage === 'momo_pending';
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title={t("wallet_topUpWallet")} />
        <ScreenScroll contentInsetBottom={80} applyTopInset={false}>
          <View style={styles.pendingCard}>
            <Text style={[styles.pendingTitle, { color: colors.ink }]}>
              {isMomo ? t('wallet_momoSentTitle') : t('wallet_cardRedirectTitle')}
            </Text>
            <Text style={[styles.pendingMessage, { color: colors.secondary }]}>
              {isMomo ? t('wallet_momoSentMessage') : t('wallet_cardRedirectMessage')}
            </Text>
            {verifyError ? (
              <Text style={[styles.verifyError, { color: colors.chili }]}>{verifyError}</Text>
            ) : null}
          </View>
        </ScreenScroll>
        <StickyFooter>
          <Pressable
            onPress={onCheckStatus}
            disabled={verifying}
            accessibilityRole="button"
            style={[styles.button, { backgroundColor: colors.marigold }, verifying && styles.buttonDisabled]}
          >
            {verifying ? (
              <ActivityIndicator color={colors.pine} />
            ) : (
              <Text style={[styles.buttonLabel, { color: colors.pine }]}>{t('wallet_checkPaymentStatus')}</Text>
            )}
          </Pressable>
        </StickyFooter>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t("wallet_topUpWallet")} />
      <ScreenScroll contentInsetBottom={80} applyTopInset={false}>
        <View style={styles.amountGap}>
          <TopupAmountInput amount={amount} onChangeAmount={setAmount} />
        </View>
        <View style={styles.chipsGap}>
          <QuickAmountChips selected={amount} onSelect={setAmount} />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
          {t("wallet_payFrom")}
        </Text>
        <View style={styles.tilesGap}>
          <MobileMoneyTile
            selected={method === "MOBILE_MONEY"}
            onPress={() => setMethod("MOBILE_MONEY")}
            phone={phone}
            onChangeNumber={() =>
              setPhone((current) => (current ? "" : (profilePhone ?? "")))
            }
          />
          <CardTile
            selected={method === "CARD"}
            onPress={() => setMethod("CARD")}
          />
        </View>
        <View style={styles.shareGap}>
          <ShareAccountantRow
            onShare={() => setOpenSheet("share")}
            onAskAccountant={() => setOpenSheet("accountant")}
          />
        </View>
      </ScreenScroll>
      <ActionSheet
        visible={openSheet === "share"}
        onClose={() => setOpenSheet(null)}
        title={t("wallet_shareSheetTitle")}
        message={t("wallet_shareSheetMessage")}
      />
      <ActionSheet
        visible={openSheet === "accountant"}
        onClose={() => setOpenSheet(null)}
        title={t("wallet_accountantSheetTitle")}
        message={t("wallet_accountantSheetMessage")}
      />
      <StickyFooter>
        <Pressable
          onPress={onConfirm}
          disabled={amount === 0 || submitting}
          accessibilityRole="button"
          accessibilityLabel={t("wallet_topUpAmount", {
            amount: formatRwf(amount),
          })}
          style={[
            styles.button,
            { backgroundColor: colors.marigold },
            (amount === 0 || submitting) && styles.buttonDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.pine} />
          ) : (
            <Text style={[styles.buttonLabel, { color: colors.pine }]}>
              {t("wallet_topUpAmount", { amount: formatRwf(amount) })}
            </Text>
          )}
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  amountGap: { marginTop: space.xl },
  chipsGap: { marginTop: space.lg },
  sectionLabel: {
    ...text.overline,
    marginTop: space.xl,
    marginBottom: space.sm,
  },
  tilesGap: { gap: space.sm },
  shareGap: { marginTop: space.md },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: { ...text.bodySemi },
  pendingCard: { marginTop: space.xl, gap: space.md },
  pendingTitle: { ...text.h2 },
  pendingMessage: { ...text.body },
  verifyError: { ...text.caption },
});

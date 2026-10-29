import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { space } from "@/theme";
import {
  MobileMoneyTile,
  CardTile,
  WalletTile,
  VoucherTile,
} from "@/components/payment";
import {
  useCheckoutStore,
  useSessionStore,
  useWalletStore,
  isVouchersUnlocked,
  canRequestVouchers,
} from "@/stores";
import { getPaymentMethodsApi, type ApiPaymentMethod } from "@/api/config.api";

export function PaymentMethodPicker() {
  const method = useCheckoutStore((state) => state.method);
  const setMethod = useCheckoutStore((state) => state.setMethod);
  const phone = useCheckoutStore((state) => state.phone);
  const setPhone = useCheckoutStore((state) => state.setPhone);
  const tier = useSessionStore((state) => state.tier);
  const role = useSessionStore((state) => state.role);
  const profilePhone = useSessionStore((state) => state.profile?.phone);
  const walletBalance = useWalletStore((state) => state.balance);
  const vouchersUnlocked = isVouchersUnlocked(tier) && canRequestVouchers(role);

  const [enabledMethods, setEnabledMethods] = useState<Set<string>>(
    new Set(["MOBILE_MONEY", "CARD", "CASH", "VOUCHER"])
  );

  useEffect(() => {
    getPaymentMethodsApi()
      .then((methods: ApiPaymentMethod[]) => {
        if (methods.length > 0) {
          setEnabledMethods(new Set(methods.map((m) => m.name.toUpperCase())));
        }
      })
      .catch(() => {
        // keep defaults on error
      });
  }, []);

  return (
    <View style={styles.list}>
      {enabledMethods.has("MOBILE_MONEY") && (
        <MobileMoneyTile
          selected={method === "MOBILE_MONEY"}
          onPress={() => setMethod("MOBILE_MONEY")}
          phone={phone}
          onChangeNumber={() => setPhone(phone ? "" : (profilePhone ?? ""))}
        />
      )}
      {enabledMethods.has("CARD") && (
        <CardTile
          selected={method === "CARD"}
          onPress={() => setMethod("CARD")}
        />
      )}
      {enabledMethods.has("CASH") && (
        <WalletTile
          selected={method === "CASH"}
          onPress={() => setMethod("CASH")}
          balance={walletBalance}
        />
      )}
      {enabledMethods.has("VOUCHER") && (
        <VoucherTile
          selected={method === "VOUCHER"}
          onPress={() => setMethod("VOUCHER")}
          disabled={!vouchersUnlocked}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
});

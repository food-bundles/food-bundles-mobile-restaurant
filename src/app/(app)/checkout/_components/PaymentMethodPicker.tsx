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

  // Map name → DB record (id + name)
  const [methodMap, setMethodMap] = useState<Record<string, ApiPaymentMethod>>({});
  const enabledMethods = Object.keys(methodMap).length > 0
    ? new Set(Object.keys(methodMap))
    : new Set(["MOBILE_MONEY", "CARD", "CASH", "VOUCHER"]);

  useEffect(() => {
    getPaymentMethodsApi()
      .then((methods: ApiPaymentMethod[]) => {
        if (methods.length > 0) {
          const map: Record<string, ApiPaymentMethod> = {};
          methods.forEach((m) => { map[m.name.toUpperCase()] = m; });
          setMethodMap(map);
          // Auto-assign DB id to current method if not yet set
          const state = useCheckoutStore.getState();
          if (!state.paymentMethodDbId) {
            const current = map[state.method];
            if (current) state.setMethod(state.method, current.id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const pick = (name: "MOBILE_MONEY" | "CARD" | "CASH" | "VOUCHER") => {
    setMethod(name, methodMap[name]?.id);
  };

  return (
    <View style={styles.list}>
      {enabledMethods.has("MOBILE_MONEY") && (
        <MobileMoneyTile
          selected={method === "MOBILE_MONEY"}
          onPress={() => pick("MOBILE_MONEY")}
          phone={phone}
          onChangeNumber={() => setPhone(phone ? "" : (profilePhone ?? ""))}
        />
      )}
      {enabledMethods.has("CARD") && (
        <CardTile
          selected={method === "CARD"}
          onPress={() => pick("CARD")}
        />
      )}
      {enabledMethods.has("CASH") && (
        <WalletTile
          selected={method === "CASH"}
          onPress={() => pick("CASH")}
          balance={walletBalance}
        />
      )}
      {enabledMethods.has("VOUCHER") && (
        <VoucherTile
          selected={method === "VOUCHER"}
          onPress={() => pick("VOUCHER")}
          disabled={!vouchersUnlocked}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm },
});

import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { hit, radius, space, text, useTheme } from "@/theme";
import { ScreenScroll, StickyFooter } from "@/components/layout";
import { PlusIcon } from "@/components/icons";
import { Input } from "@/components/primitives";
import { DeliveryMap } from "./_components/DeliveryMap";
import {
  CheckoutStepHeader,
  DeliveryWindowPicker,
} from "@/components/checkout";
import { useCheckoutStore, useCartStore, useAddressesStore } from "@/stores";
import { useT } from "@/i18n";

export default function CheckoutDelivery() {
  const t = useT();
  const { colors } = useTheme();
  const windowIndex = useCheckoutStore((state) => state.windowIndex);
  const setWindowIndex = useCheckoutStore((state) => state.setWindowIndex);
  const setAddress = useCheckoutStore((state) => state.setAddress);
  const setCartId = useCheckoutStore((state) => state.setCartId);
  const serverCart = useCartStore((state) => state.serverCart);
  const addresses = useAddressesStore((s) => s.addresses);
  const fetchAddresses = useAddressesStore((s) => s.fetch);
  const addressStatus = useAddressesStore((s) => s.status);
  const [manual, setManual] = useState(false);
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (addressStatus === 'idle') fetchAddresses();
  }, [addressStatus, fetchAddresses]);

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? defaultAddress;

  const onContinue = () => {
    if (serverCart?.id) setCartId(serverCart.id);
    if (manual && street.trim()) {
      setAddress(`${street.trim()}${landmark ? ", " + landmark : ""}`);
    } else if (selectedAddress) {
      setAddress(`${selectedAddress.street}${selectedAddress.landmark ? ', ' + selectedAddress.landmark : ''}`);
    }
    router.push("/(app)/checkout/payment");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <CheckoutStepHeader title={t("checkout_deliveryDetails")} step={1} />
      <ScreenScroll contentInsetBottom={80} applyTopInset={false}>
        <View style={styles.mapBleed}>
          <DeliveryMap />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
          {t("checkout_deliverTo")}
        </Text>
        {addresses.length > 0 ? (
          addresses.map((addr) => {
            const isSelected = addr.id === (selectedAddressId ?? defaultAddress?.id);
            return (
              <Pressable
                key={addr.id}
                onPress={() => { setSelectedAddressId(addr.id); setManual(false); }}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                style={[
                  styles.addressCard,
                  {
                    backgroundColor: colors.paper,
                    borderColor: isSelected ? colors.leaf : colors.hairline,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.addressRow}>
                  <View style={styles.addressText}>
                    <Text style={[styles.addressTitle, { color: colors.ink }]}>{addr.label}</Text>
                    <Text style={[styles.addressLine, { color: colors.secondary }]}>
                      {addr.street}{addr.landmark ? `, ${addr.landmark}` : ''}
                    </Text>
                  </View>
                  <View style={[styles.radio, { borderColor: isSelected ? colors.leaf : colors.hairline }]}>
                    {isSelected && <View style={[styles.radioDot, { backgroundColor: colors.leaf }]} />}
                  </View>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={[styles.addressCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            <Text style={[styles.addressLine, { color: colors.secondary }]}>{t("checkout_addAddress")}</Text>
          </View>
        )}
        <Pressable
          onPress={() => router.push('/(app)/settings/addresses')}
          accessibilityRole="button"
          accessibilityLabel={t("checkout_addAddress")}
          style={styles.linkRow}
        >
          <PlusIcon size={18} color={colors.leaf} />
          <Text style={[styles.linkLabel, { color: colors.leaf }]}>
            {t("checkout_addAddress")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setManual((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={t("checkout_enterManually")}
          style={styles.linkRow}
        >
          <Text style={[styles.linkLabelMuted, { color: colors.secondary }]}>
            {t("checkout_enterManually")}
          </Text>
        </Pressable>
        {manual ? (
          <View style={styles.manualFields}>
            <Input
              label={t("checkout_street")}
              value={street}
              onChangeText={setStreet}
            />
            <Input
              label={t("checkout_landmarkOptional")}
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>
        ) : null}
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
          {t("checkout_deliveryWindow")}
        </Text>
        <DeliveryWindowPicker
          selected={windowIndex}
          onSelect={setWindowIndex}
        />
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel={t("checkout_continuePayment")}
          style={[styles.button, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.buttonLabel, { color: colors.paper }]}>
            {t("checkout_continuePayment")}
          </Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapBleed: { marginTop: space.md, marginHorizontal: -space.lg },
  sectionLabel: {
    ...text.overline,
    marginTop: space.md,
    marginBottom: space.sm,
  },
  addressCard: { borderRadius: radius.lg, padding: space.md, marginBottom: space.sm },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  addressText: { flex: 1 },
  addressTitle: { ...text.bodySemi },
  addressLine: { ...text.caption, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    minHeight: hit.min,
    paddingVertical: space.xs,
  },
  linkLabel: { ...text.bodySemi },
  linkLabelMuted: { ...text.bodySemi },
  manualFields: { gap: space.sm, marginBottom: space.sm },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: { ...text.bodySemi },
});

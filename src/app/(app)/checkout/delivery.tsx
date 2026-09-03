import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { PlusIcon } from '@/components/icons';
import { Input } from '@/components/primitives';
import { DeliveryMap } from './_components/DeliveryMap';
import { CheckoutStepHeader, DeliveryWindowPicker } from '@/components/checkout';
import { useCheckoutStore } from '@/stores';
import { useT } from '@/i18n';
import { account } from '@/mocks';

export default function CheckoutDelivery() {
  const t = useT();
  const { colors } = useTheme();
  const address = useCheckoutStore((state) => state.address);
  const windowIndex = useCheckoutStore((state) => state.windowIndex);
  const setWindowIndex = useCheckoutStore((state) => state.setWindowIndex);
  const [manual, setManual] = useState(false);
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <CheckoutStepHeader title={t('checkout_deliveryDetails')} step={1} />
      <ScreenScroll contentInsetBottom={80} applyTopInset={false}>
        <View style={styles.mapBleed}>
          <DeliveryMap />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('checkout_deliverTo')}</Text>
        <View style={[styles.addressCard, { backgroundColor: colors.paper, borderColor: colors.leaf }]}>
          <Text style={[styles.addressTitle, { color: colors.ink }]}>{account.businessName}</Text>
          <Text style={[styles.addressLine, { color: colors.secondary }]}>{address}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('checkout_addAddress')}
          style={styles.linkRow}
        >
          <PlusIcon size={18} color={colors.leaf} />
          <Text style={[styles.linkLabel, { color: colors.leaf }]}>{t('checkout_addAddress')}</Text>
        </Pressable>
        <Pressable
          onPress={() => setManual((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_enterManually')}
          style={styles.linkRow}
        >
          <Text style={[styles.linkLabelMuted, { color: colors.secondary }]}>{t('checkout_enterManually')}</Text>
        </Pressable>
        {manual ? (
          <View style={styles.manualFields}>
            <Input label={t('checkout_street')} value={street} onChangeText={setStreet} />
            <Input label={t('checkout_landmarkOptional')} value={landmark} onChangeText={setLandmark} />
          </View>
        ) : null}
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('checkout_deliveryWindow')}</Text>
        <DeliveryWindowPicker selected={windowIndex} onSelect={setWindowIndex} />
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push('/(app)/checkout/payment')}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_continuePayment')}
          style={[styles.button, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.buttonLabel, { color: colors.paper }]}>{t('checkout_continuePayment')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapBleed: { marginTop: space.md, marginHorizontal: -space.lg },
  sectionLabel: { ...text.overline, marginTop: space.md, marginBottom: space.sm },
  addressCard: {
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: space.md,
  },
  addressTitle: { ...text.bodySemi },
  addressLine: { ...text.caption, marginTop: 2 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { ...text.bodySemi },
});

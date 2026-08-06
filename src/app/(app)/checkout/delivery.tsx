import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
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
  const address = useCheckoutStore((state) => state.address);
  const windowIndex = useCheckoutStore((state) => state.windowIndex);
  const setWindowIndex = useCheckoutStore((state) => state.setWindowIndex);
  const [manual, setManual] = useState(false);
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');

  return (
    <View style={styles.container}>
      <CheckoutStepHeader title={t('checkout_deliveryDetails')} step={1} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.mapGap}>
          <DeliveryMap />
        </View>
        <Text style={styles.sectionLabel}>{t('checkout_deliverTo')}</Text>
        <View style={styles.addressCard}>
          <Text style={styles.addressTitle}>{account.businessName}</Text>
          <Text style={styles.addressLine}>{address}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('checkout_addAddress')}
          style={styles.linkRow}
        >
          <PlusIcon size={18} color={color.leaf} />
          <Text style={styles.linkLabel}>{t('checkout_addAddress')}</Text>
        </Pressable>
        <Pressable
          onPress={() => setManual((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_enterManually')}
          style={styles.linkRow}
        >
          <Text style={styles.linkLabelMuted}>{t('checkout_enterManually')}</Text>
        </Pressable>
        {manual ? (
          <View style={styles.manualFields}>
            <Input label={t('checkout_street')} value={street} onChangeText={setStreet} />
            <Input label={t('checkout_landmarkOptional')} value={landmark} onChangeText={setLandmark} />
          </View>
        ) : null}
        <Text style={styles.sectionLabel}>{t('checkout_deliveryWindow')}</Text>
        <DeliveryWindowPicker selected={windowIndex} onSelect={setWindowIndex} />
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push('/(app)/checkout/payment')}
          accessibilityRole="button"
          accessibilityLabel={t('checkout_continuePayment')}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>{t('checkout_continuePayment')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  mapGap: { marginTop: space.md, borderRadius: radius.lg, overflow: 'hidden' },
  sectionLabel: { ...text.overline, color: color.secondary, marginTop: space.md, marginBottom: space.sm },
  addressCard: {
    backgroundColor: color.paper,
    borderWidth: 1.5,
    borderColor: color.leaf,
    borderRadius: radius.lg,
    padding: space.md,
  },
  addressTitle: { ...text.bodySemi, color: color.ink },
  addressLine: { ...text.caption, color: color.secondary, marginTop: 2 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: hit.min,
    paddingVertical: space.xs,
  },
  linkLabel: { ...text.bodySemi, color: color.leaf },
  linkLabelMuted: { ...text.bodySemi, color: color.secondary },
  manualFields: { gap: space.sm, marginBottom: space.sm },
  button: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { ...text.bodySemi, color: color.paper },
});

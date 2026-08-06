import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { Input } from '@/components/primitives';
import { CheckoutStepHeader } from '../_components/CheckoutStepHeader';
import { DeliveryWindowPicker } from '../_components/DeliveryWindowPicker';
import { useT } from '@/i18n';

export default function GuestDelivery() {
  const t = useT();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [windowIndex, setWindowIndex] = useState(0);

  const canContinue = name.trim().length > 0 && phone.trim().length > 0 && street.trim().length > 0;

  return (
    <View style={styles.container}>
      <CheckoutStepHeader title={t('guest_deliveryDetails')} step={1} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.fields}>
          <Input label={t('guest_contactName')} value={name} onChangeText={setName} />
          <Input label={t('guest_phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label={t('guest_street')} value={street} onChangeText={setStreet} />
          <Input label={t('guest_landmark')} value={landmark} onChangeText={setLandmark} />
        </View>
        <View style={styles.windowGap}>
          <DeliveryWindowPicker selected={windowIndex} onSelect={setWindowIndex} />
        </View>
        <Text style={styles.note}>{t('guest_addressNotSaved')}</Text>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push('/(public)/guest/payment')}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityLabel={t('guest_continueToPayment')}
          style={[styles.button, !canContinue && styles.buttonDisabled]}
        >
          <Text style={styles.buttonLabel}>{t('guest_continueToPayment')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  fields: { gap: space.md, marginTop: space.md },
  windowGap: { marginTop: space.lg },
  note: { ...text.caption, color: color.muted, marginTop: space.md },
  button: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: { ...text.bodySemi, color: color.paper },
});

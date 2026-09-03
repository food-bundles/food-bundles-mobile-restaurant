import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { useT } from '@/i18n';
import { account } from '@/mocks';

export default function BusinessDetails() {
  const t = useT();
  const { colors } = useTheme();
  const [businessName, setBusinessName] = useState(account.businessName);
  const [address, setAddress] = useState(account.address);
  const [tin, setTin] = useState(account.tin);
  const [contactPerson, setContactPerson] = useState(`${account.managerName} · ${account.phone}`);
  const [email, setEmail] = useState(account.email);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('business_title')} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.fields}>
          <Input label={t('business_name')} value={businessName} onChangeText={setBusinessName} />
          <Input label={t('business_address')} value={address} onChangeText={setAddress} />
          <Input label={t('underwriting_tin')} value={tin} onChangeText={setTin} />
          <Input label={t('business_contactPerson')} value={contactPerson} onChangeText={setContactPerson} />
          <Input label={t('business_email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('business_saveChanges')}
          style={[styles.saveButton, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.saveLabel, { color: colors.paper }]}>{t('business_saveChanges')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fields: { gap: space.md, marginTop: space.md },
  saveButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLabel: { ...text.bodySemi },
});

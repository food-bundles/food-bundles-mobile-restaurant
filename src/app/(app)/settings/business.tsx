import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { useSessionStore } from '@/stores';
import { updateProfileApi } from '@/api/auth.api';
import { useT } from '@/i18n';

export default function BusinessDetails() {
  const t = useT();
  const { colors } = useTheme();
  const profile = useSessionStore((state) => state.profile);

  const [businessName, setBusinessName] = useState(profile?.name ?? '');
  const [tin, setTin] = useState(profile?.tin ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfileApi({ name: businessName, tin, email, phone });
      useSessionStore.setState((s) => ({ ...s, profile: updated ? { ...s.profile!, ...updated } : s.profile }));
      router.back();
    } catch {
      // silently fail — user stays on screen
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('business_title')} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.fields}>
          <Input label={t('business_name')} value={businessName} onChangeText={setBusinessName} />
          <Input label={t('underwriting_tin')} value={tin} onChangeText={setTin} />
          <Input label={t('business_email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label={t('business_contactPerson')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={t('business_saveChanges')}
          style={[styles.saveButton, { backgroundColor: colors.leaf }, saving && styles.saveDisabled]}
        >
          {saving ? <ActivityIndicator color={colors.paper} /> : <Text style={[styles.saveLabel, { color: colors.paper }]}>{t('business_saveChanges')}</Text>}
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fields: { gap: space.md, marginTop: space.md },
  saveButton: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  saveDisabled: { opacity: 0.5 },
  saveLabel: { ...text.bodySemi },
});

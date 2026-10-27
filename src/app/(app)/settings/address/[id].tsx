import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { useAddressesStore } from '@/stores';
import { useT } from '@/i18n';

export default function EditAddress() {
  const t = useT();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const addresses = useAddressesStore((s) => s.addresses);
  const createAddress = useAddressesStore((s) => s.create);
  const updateAddress = useAddressesStore((s) => s.update);
  const existing = useMemo(() => addresses.find((a) => a.id === id), [id, addresses]);

  const [label, setLabel] = useState(existing?.label ?? '');
  const [street, setStreet] = useState(existing?.street ?? '');
  const [landmark, setLandmark] = useState(existing?.landmark ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!label || !street || !phone) return;
    setSaving(true);
    try {
      if (id === 'new') {
        await createAddress({ label, street, landmark: landmark || undefined, phone });
      } else {
        await updateAddress(id, { label, street, landmark: landmark || undefined, phone });
      }
      router.back();
    } catch {
      // stay on screen
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('addressEdit_title')} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.fields}>
          <Input label={t('addressEdit_label')} value={label} onChangeText={setLabel} />
          <Input label={t('addressEdit_street')} value={street} onChangeText={setStreet} />
          <Input label={t('addressEdit_landmark')} value={landmark} onChangeText={setLandmark} />
          <Input label={t('guest_phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={t('addressEdit_save')}
          style={[styles.saveButton, { backgroundColor: colors.leaf }, saving && styles.saveDisabled]}
        >
          {saving
            ? <ActivityIndicator color={colors.paper} />
            : <Text style={[styles.saveLabel, { color: colors.paper }]}>{t('addressEdit_save')}</Text>}
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
  saveDisabled: { opacity: 0.5 },
  saveLabel: { ...text.bodySemi },
});

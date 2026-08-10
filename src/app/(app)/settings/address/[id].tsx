import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { addresses } from '@/mocks';
import { useT } from '@/i18n';

export default function EditAddress() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const existing = useMemo(() => addresses.find((address) => address.id === id), [id]);

  const [label, setLabel] = useState(existing?.label ?? '');
  const [street, setStreet] = useState(existing?.street ?? '');
  const [landmark, setLandmark] = useState(existing?.landmark ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');

  return (
    <View style={styles.container}>
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
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('addressEdit_save')}
          style={styles.saveButton}
        >
          <Text style={styles.saveLabel}>{t('addressEdit_save')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  fields: { gap: space.md, marginTop: space.md },
  saveButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLabel: { ...text.bodySemi, color: color.paper },
});

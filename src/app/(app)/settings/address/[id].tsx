import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
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
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('addressEdit_title')}</Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink },
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

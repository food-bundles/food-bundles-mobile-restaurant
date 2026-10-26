import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { PersonIcon } from '@/components/icons';
import { Input } from '@/components/primitives';
import { PermissionRow } from './_components/PermissionRow';
import { useAffiliatorsStore } from '@/stores';
import { useT } from '@/i18n';

export default function AddAffiliator() {
  const t = useT();
  const { colors } = useTheme();
  const createAffiliator = useAffiliatorsStore((s) => s.create);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [canRequestVouchers, setCanRequestVouchers] = useState(false);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (!fullName || (!email && !phone)) return;
    setSaving(true);
    try {
      await createAffiliator({ name: fullName, email: email || undefined, phone: phone || undefined });
      router.back();
    } catch {
      // stay on screen
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('aff_addTitle')} />
      <ScreenScroll contentInsetBottom={80}>
        <Text style={[styles.label, { color: colors.ink }]}>{t('aff_photo')}</Text>
        <View style={styles.photoRow}>
          <View
            style={[
              styles.photoPlaceholder,
              { backgroundColor: colors.neutral, borderColor: colors.disabledLine },
            ]}
          >
            <PersonIcon size={22} color={colors.muted} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('aff_uploadPhoto')}
            style={[styles.uploadButton, { borderColor: colors.hairline }]}
          >
            <Text style={[styles.uploadLabel, { color: colors.leaf }]}>{t('aff_uploadPhoto')}</Text>
          </Pressable>
        </View>
        <View style={styles.fields}>
          <Input label={t('aff_fullName')} value={fullName} onChangeText={setFullName} />
          <Input label={t('aff_emailCredentials')} value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label={t('aff_phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
        <Text style={[styles.permissionsLabel, { color: colors.secondary }]}>{t('aff_permissions')}</Text>
        <PermissionRow label={t('aff_placeOrders')} enabled />
        <PermissionRow
          label={t('aff_useVouchers')}
          enabled={canRequestVouchers}
          onToggle={() => setCanRequestVouchers((prev) => !prev)}
          note={t('aff_voucherNote')}
        />
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onSubmit}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={t('aff_sendInvite')}
          style={[styles.submitButton, { backgroundColor: colors.leaf }, saving && { opacity: 0.5 }]}
        >
          {saving
            ? <ActivityIndicator color={colors.paper} />
            : <Text style={[styles.submitLabel, { color: colors.paper }]}>{t('aff_sendInvite')}</Text>}
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { ...text.label, marginTop: space.md, marginBottom: space.sm },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadLabel: { ...text.label },
  fields: { gap: space.md, marginTop: space.lg },
  permissionsLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  submitButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: { ...text.bodySemi },
});

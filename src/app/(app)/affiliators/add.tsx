import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon, PersonIcon } from '@/components/icons';
import { Input } from '@/components/primitives';
import { PermissionRow } from './_components/PermissionRow';
import { useT } from '@/i18n';

export default function AddAffiliator() {
  const t = useT();
  const [fullName, setFullName] = useState('Eric Niyonzima');
  const [email, setEmail] = useState('eric.niyonzima@kigalibistro.rw');
  const [role, setRole] = useState('Purchasing');
  const [phone, setPhone] = useState('+250 788 555 012');
  const [canRequestVouchers, setCanRequestVouchers] = useState(false);

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
        <Text style={styles.title}>{t('aff_addTitle')}</Text>
      </View>
      <ScreenScroll contentInsetBottom={80}>
        <Text style={styles.label}>{t('aff_photo')}</Text>
        <View style={styles.photoRow}>
          <View style={styles.photoPlaceholder}>
            <PersonIcon size={22} color={color.muted} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('aff_uploadPhoto')}
            style={styles.uploadButton}
          >
            <Text style={styles.uploadLabel}>{t('aff_uploadPhoto')}</Text>
          </Pressable>
        </View>
        <View style={styles.fields}>
          <Input label={t('aff_fullName')} value={fullName} onChangeText={setFullName} />
          <Input label={t('aff_emailCredentials')} value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label={t('aff_role')} value={role} onChangeText={setRole} />
          <Input label={t('aff_phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
        <Text style={styles.permissionsLabel}>{t('aff_permissions')}</Text>
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
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('aff_sendInvite')}
          style={styles.submitButton}
        >
          <Text style={styles.submitLabel}>{t('aff_sendInvite')}</Text>
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
  label: { ...text.label, color: color.ink, marginTop: space.md, marginBottom: space.sm },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.neutral,
    borderWidth: 1.5,
    borderColor: color.disabledLine,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadLabel: { ...text.label, color: color.leaf },
  fields: { gap: space.md, marginTop: space.lg },
  permissionsLabel: { ...text.overline, color: color.secondary, marginTop: space.lg, marginBottom: space.sm },
  submitButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: { ...text.bodySemi, color: color.paper },
});

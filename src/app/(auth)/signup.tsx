import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { Input } from '@/components/primitives';
import { ChevronLeftIcon } from '@/components/icons';
import { useSessionStore } from '@/stores/sessionStore';
import { useT } from '@/i18n';
import { account } from '@/mocks';
import { formatTin, isValidTin } from '@/lib';
import type { Role } from '@/mocks/types';

export default function Signup() {
  const t = useT();
  const login = useSessionStore((s) => s.login);
  const setRole = useSessionStore((s) => s.setRole);
  const [businessName, setBusinessName] = useState(account.businessName);
  const [businessType, setBusinessType] = useState<Extract<Role, 'RESTAURANT' | 'HOTEL'>>('RESTAURANT');
  const [phone, setPhone] = useState(account.phone);
  const [tin, setTin] = useState(formatTin(account.tin));
  const [tinTouched, setTinTouched] = useState(false);

  const tinInvalid = tinTouched && !isValidTin(tin);

  const onSubmit = () => {
    if (!isValidTin(tin)) {
      setTinTouched(true);
      return;
    }
    setRole(businessType);
    login();
    router.replace('/(app)/(tabs)');
  };

  return (
    <ScreenScroll contentContainerStyle={styles.content}>
      <View>
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel={t('auth_backToLogin')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('auth_createAccountTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth_forRestaurants')}</Text>
        <View style={styles.fields}>
          <Input label={t('auth_businessName')} value={businessName} onChangeText={setBusinessName} />
          <View>
            <Text style={styles.typeLabel}>{t('auth_businessType')}</Text>
            <View style={styles.typeRow}>
              {(['RESTAURANT', 'HOTEL'] as const).map((type) => {
                const active = type === businessType;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setBusinessType(type)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={type === 'RESTAURANT' ? t('auth_restaurant') : t('auth_hotel')}
                    style={[styles.typeOption, active && styles.typeOptionActive]}
                  >
                    <Text style={[styles.typeLabelText, active && styles.typeLabelTextActive]}>
                      {type === 'RESTAURANT' ? t('auth_restaurant') : t('auth_hotel')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <Input label={t('auth_phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input
            label={t('auth_tin')}
            value={tin}
            onChangeText={(value) => setTin(formatTin(value))}
            keyboardType="number-pad"
            maxLength={12}
            helper={tinInvalid ? undefined : t('auth_tinHelper')}
            helperTone="amber"
            error={tinInvalid ? t('auth_tinError') : undefined}
          />
        </View>
      </View>
      <View>
        <Pressable
          onPress={onSubmit}
          accessibilityRole="button"
          accessibilityLabel={t('auth_createAccountBtn')}
          style={styles.submitButton}
        >
          <Text style={styles.submitLabel}>{t('auth_createAccountBtn')}</Text>
        </Pressable>
        <Text style={styles.staffNote}>{t('auth_staffNote')}</Text>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'space-between' },
  backButton: {
    width: hit.min,
    height: hit.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: color.paper,
  },
  title: { ...text.h1, color: color.ink, marginTop: space.lg },
  subtitle: { ...text.caption, color: color.secondary, marginTop: space.xs, marginBottom: space.lg },
  fields: { gap: space.md },
  typeLabel: { ...text.label, color: color.ink, marginBottom: space.xs },
  typeRow: { flexDirection: 'row', gap: space.sm },
  typeOption: {
    flex: 1,
    minHeight: hit.min,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeOptionActive: { backgroundColor: color.leaf, borderColor: color.leaf },
  typeLabelText: { ...text.bodySemi, color: color.secondary },
  typeLabelTextActive: { color: color.paper },
  submitButton: {
    minHeight: hit.min,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: { ...text.bodySemi, color: color.paper },
  staffNote: { ...text.caption, color: color.muted, marginTop: space.md },
});

import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { OtpBoxes } from '@/components/checkout';
import { TotpQrCode } from './_components/TotpQrCode';
import { TwoFactorEnabledScreen } from './_components/TwoFactorEnabledScreen';
import { useT } from '@/i18n';
import { useSessionStore } from '@/stores';
import { account } from '@/mocks';
import { generateTotpSecret, buildOtpauthUri, currentMockTotpCode, validateTotp } from '@/lib';

const CODE_LENGTH = 6;

export default function TwoFactorSetup() {
  const t = useT();
  const { colors } = useTheme();
  const enableTwoFactor = useSessionStore((state) => state.enableTwoFactor);
  const secret = useMemo(() => generateTotpSecret(), []);
  const otpauthUri = useMemo(() => buildOtpauthUri(secret, account.email), [secret]);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [enabled, setEnabled] = useState(false);

  if (enabled) return <TwoFactorEnabledScreen />;

  const onVerify = () => {
    if (validateTotp(secret, code)) {
      enableTwoFactor(secret);
      setEnabled(true);
    } else {
      setError(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('settings_twoFactor')} />
      <ScreenScroll contentInsetBottom={80}>
        <Text style={[styles.intro, { color: colors.secondary }]}>{t('settings_twoFactorIntro')}</Text>
        <TotpQrCode otpauthUri={otpauthUri} secret={secret} />
        <Text style={[styles.label, { color: colors.ink }]}>{t('settings_enterCode')}</Text>
        <View style={styles.boxesWrap}>
          <TextInput
            value={code}
            onChangeText={(next) => {
              setCode(next.replace(/\D/g, '').slice(0, CODE_LENGTH));
              setError(false);
            }}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            accessibilityLabel={t('settings_enterCode')}
            style={styles.hiddenInput}
          />
          <View style={styles.boxesVisual} pointerEvents="none">
            <OtpBoxes value={code} length={CODE_LENGTH} />
          </View>
        </View>
        {error ? <Text style={[styles.errorText, { color: colors.chili }]}>{t('settings_twoFactorInvalidCode')}</Text> : null}
        {__DEV__ ? (
          <Pressable
            onPress={() => setCode(currentMockTotpCode(secret))}
            accessibilityRole="button"
            accessibilityLabel={t('settings_devFillCode')}
            style={styles.devRow}
          >
            <Text style={[styles.devLabel, { color: colors.secondary }]}>{t('settings_devFillCode')}</Text>
          </Pressable>
        ) : null}
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onVerify}
          disabled={code.length !== CODE_LENGTH}
          accessibilityRole="button"
          accessibilityLabel={t('settings_enable2fa')}
          style={[
            styles.enableButton,
            { backgroundColor: colors.leaf },
            code.length !== CODE_LENGTH && styles.enableDisabled,
          ]}
        >
          <Text style={[styles.enableLabel, { color: colors.paper }]}>{t('settings_enable2fa')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.body, marginTop: space.md },
  label: { ...text.label, marginTop: space.lg, marginBottom: space.sm },
  boxesWrap: { position: 'relative', height: 56 },
  boxesVisual: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hiddenInput: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 },
  errorText: { ...text.caption, marginTop: space.xs },
  devRow: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center', marginTop: space.sm },
  devLabel: { ...text.label },
  enableButton: {
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableDisabled: { opacity: 0.5 },
  enableLabel: { ...text.bodySemi },
});

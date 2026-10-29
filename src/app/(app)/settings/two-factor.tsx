import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { OtpBoxes } from '@/components/checkout';
import { TwoFactorEnabledScreen } from './_components/TwoFactorEnabledScreen';
import { useT } from '@/i18n';
import { useSessionStore } from '@/stores';
import { enable2FAApi, verifySetup2FAApi, disable2FAApi, regenerateBackupCodesApi } from '@/api/twoFactor.api';
import type { TwoFactorSetupData } from '@/api/twoFactor.api';

const CODE_LENGTH = 6;

type Stage =
  | 'loading'
  | 'setup_qr'        // show QR + enter code to enable
  | 'setup_done'      // just enabled — show TwoFactorEnabledScreen
  | 'manage'          // already enabled — show disable / regen options
  | 'disable_confirm' // enter code to disable
  | 'regen_confirm'   // enter code to regen backup codes
  | 'regen_done';     // show new backup codes

export default function TwoFactorSetup() {
  const t = useT();
  const { colors } = useTheme();
  const enableTwoFactor = useSessionStore((state) => state.enableTwoFactor);
  const disableTwoFactor = useSessionStore((state) => state.disableTwoFactor);
  const fetchTwoFactorStatus = useSessionStore((state) => state.fetchTwoFactorStatus);

  const [stage, setStage] = useState<Stage>('loading');
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);
  const initRef = useRef(false);

  const resetCode = () => { setCode(''); setError(null); };

  // On mount: sync real status from backend, then decide starting stage
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      await fetchTwoFactorStatus();
      // After fetch, twoFactorEnabled reflects real backend state
      const enabled = useSessionStore.getState().twoFactorEnabled;
      if (enabled) {
        setStage('manage');
      } else {
        // Begin setup by fetching QR + secret from backend
        try {
          const data = await enable2FAApi();
          setSetupData(data);
          setStage('setup_qr');
        } catch {
          setError(t('settings_twoFactorSetupError'));
          setStage('setup_qr');
        }
      }
    })();
  }, []);

  const onVerifySetup = useCallback(async () => {
    if (!setupData || code.length !== CODE_LENGTH) return;
    setBusy(true);
    setError(null);
    try {
      const verified = await verifySetup2FAApi(code);
      if (verified) {
        enableTwoFactor(setupData.secret);
        setStage('setup_done');
      } else {
        setError(t('settings_twoFactorInvalidCode'));
      }
    } catch {
      setError(t('settings_twoFactorInvalidCode'));
    } finally {
      setBusy(false);
    }
  }, [setupData, code, enableTwoFactor, t]);

  const onDisable = useCallback(async () => {
    if (code.length !== CODE_LENGTH) return;
    setBusy(true);
    setError(null);
    try {
      await disable2FAApi(code);
      disableTwoFactor();
      setStage('loading');
      // Re-init: fetch fresh status and show setup flow
      initRef.current = false;
      const data = await enable2FAApi();
      setSetupData(data);
      resetCode();
      setStage('setup_qr');
    } catch {
      setError(t('settings_twoFactorInvalidCode'));
      setBusy(false);
    }
  }, [code, disableTwoFactor, t]);

  const onRegenerateBackupCodes = useCallback(async () => {
    if (code.length !== CODE_LENGTH) return;
    setBusy(true);
    setError(null);
    try {
      const codes = await regenerateBackupCodesApi(code);
      setNewBackupCodes(codes);
      resetCode();
      setStage('regen_done');
    } catch {
      setError(t('settings_twoFactorInvalidCode'));
    } finally {
      setBusy(false);
    }
  }, [code, t]);

  // ── Stages ──────────────────────────────────────────────────────────────

  if (stage === 'loading') {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title={t('settings_twoFactor')} />
        <View style={styles.center}>
          <ActivityIndicator color={colors.leaf} size="large" />
        </View>
      </View>
    );
  }

  if (stage === 'setup_done') {
    return <TwoFactorEnabledScreen />;
  }

  if (stage === 'manage') {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title={t('settings_twoFactor')} />
        <ScreenScroll contentInsetBottom={24}>
          <View style={[styles.statusBadge, { backgroundColor: colors.ripe + '22' }]}>
            <Text style={[styles.statusText, { color: colors.ripe }]}>{t('settings_twoFactorActive')}</Text>
          </View>
          <Text style={[styles.intro, { color: colors.secondary }]}>{t('settings_twoFactorManageIntro')}</Text>

          <View style={styles.actionsWrap}>
            <Pressable
              onPress={() => { resetCode(); setStage('disable_confirm'); }}
              accessibilityRole="button"
              style={[styles.actionRow, { borderColor: colors.hairline }]}
            >
              <Text style={[styles.actionLabel, { color: colors.chili }]}>{t('settings_disable2fa')}</Text>
            </Pressable>
            <Pressable
              onPress={() => { resetCode(); setStage('regen_confirm'); }}
              accessibilityRole="button"
              style={[styles.actionRow, { borderColor: colors.hairline }]}
            >
              <Text style={[styles.actionLabel, { color: colors.ink }]}>{t('settings_regenBackupCodes')}</Text>
            </Pressable>
          </View>
        </ScreenScroll>
      </View>
    );
  }

  if (stage === 'regen_done') {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title={t('settings_twoFactor')} />
        <ScreenScroll contentInsetBottom={80}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('settings_newBackupCodes')}</Text>
          <Text style={[styles.intro, { color: colors.secondary }]}>{t('settings_backupCodesIntro')}</Text>
          <View style={[styles.codesBox, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            {newBackupCodes.map((c) => (
              <Text key={c} style={[styles.codeItem, { color: colors.ink }]}>{c}</Text>
            ))}
          </View>
        </ScreenScroll>
        <StickyFooter>
          <Pressable
            onPress={() => setStage('manage')}
            accessibilityRole="button"
            style={[styles.enableButton, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.enableLabel, { color: colors.paper }]}>{t('settings_done')}</Text>
          </Pressable>
        </StickyFooter>
      </View>
    );
  }

  // ── Code entry screens (setup_qr, disable_confirm, regen_confirm) ────────

  const isSetup = stage === 'setup_qr';
  const isDisable = stage === 'disable_confirm';

  const onSubmit = isSetup ? onVerifySetup : isDisable ? onDisable : onRegenerateBackupCodes;
  const submitLabel = isSetup
    ? t('settings_enable2fa')
    : isDisable
    ? t('settings_disable2fa')
    : t('settings_regenBackupCodes');

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('settings_twoFactor')} />
      <ScreenScroll contentInsetBottom={80}>

        {/* Setup QR code section */}
        {isSetup && setupData ? (
          <>
            <Text style={[styles.intro, { color: colors.secondary }]}>{t('settings_twoFactorIntro')}</Text>
            <View style={[styles.qrWrap, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
              <Image
                source={{ uri: setupData.qrCode }}
                style={styles.qrImage}
                resizeMode="contain"
                accessibilityLabel={t('settings_scanWithApp')}
              />
            </View>
            <Text style={[styles.secretLabel, { color: colors.secondary }]}>{t('settings_cantScan')}</Text>
            <View style={[styles.secretBox, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
              <Text style={[styles.secretText, { color: colors.ink }]} selectable>{setupData.secret}</Text>
            </View>

            {/* Backup codes shown upfront during setup */}
            {setupData.backupCodes?.length ? (
              <>
                <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('settings_backupCodesTitle')}</Text>
                <Text style={[styles.intro, { color: colors.secondary }]}>{t('settings_backupCodesIntro')}</Text>
                <View style={[styles.codesBox, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                  {setupData.backupCodes.map((c) => (
                    <Text key={c} style={[styles.codeItem, { color: colors.ink }]}>{c}</Text>
                  ))}
                </View>
              </>
            ) : null}
          </>
        ) : null}

        {/* Disable / regen confirmation intro */}
        {!isSetup ? (
          <Text style={[styles.intro, { color: colors.secondary }]}>
            {isDisable ? t('settings_disable2faIntro') : t('settings_regenBackupCodesIntro')}
          </Text>
        ) : null}

        {/* Code entry */}
        <Text style={[styles.label, { color: colors.ink }]}>{t('settings_enterCode')}</Text>
        <View style={styles.boxesWrap}>
          <TextInput
            value={code}
            onChangeText={(next) => {
              setCode(next.replace(/\D/g, '').slice(0, CODE_LENGTH));
              setError(null);
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
        {error ? <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text> : null}
      </ScreenScroll>

      <StickyFooter>
        <Pressable
          onPress={onSubmit}
          disabled={code.length !== CODE_LENGTH || busy}
          accessibilityRole="button"
          accessibilityLabel={submitLabel}
          style={[
            styles.enableButton,
            { backgroundColor: isDisable ? colors.chili : colors.leaf },
            (code.length !== CODE_LENGTH || busy) && styles.enableDisabled,
          ]}
        >
          {busy
            ? <ActivityIndicator color={colors.paper} />
            : <Text style={[styles.enableLabel, { color: colors.paper }]}>{submitLabel}</Text>
          }
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  intro: { ...text.body, marginTop: space.md },
  sectionTitle: { ...text.h2, marginTop: space.lg },
  label: { ...text.label, marginTop: space.lg, marginBottom: space.sm },
  boxesWrap: { position: 'relative', height: 56 },
  boxesVisual: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hiddenInput: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 },
  errorText: { ...text.caption, marginTop: space.xs },
  enableButton: {
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableDisabled: { opacity: 0.5 },
  enableLabel: { ...text.bodySemi },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    marginTop: space.md,
  },
  statusText: { ...text.label },
  actionsWrap: { marginTop: space.xl, gap: space.sm },
  actionRow: {
    minHeight: hit.min,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  actionLabel: { ...text.bodySemi },
  qrWrap: {
    alignSelf: 'center',
    marginTop: space.lg,
    padding: space.md,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  qrImage: { width: 180, height: 180 },
  secretLabel: { ...text.caption, marginTop: space.md },
  secretBox: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: space.sm,
    marginTop: space.xs,
  },
  secretText: { ...text.label, fontFamily: 'monospace', fontSize: 13, letterSpacing: 1 },
  codesBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.sm,
    gap: space.xs,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  codeItem: { ...text.label, fontFamily: 'monospace', fontSize: 13, width: '45%' },
});

import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { OtpBoxes } from '@/components/checkout';
import { sleep } from '@/lib';
import { useT } from '@/i18n';
import { account } from '@/mocks';

const CODE_LENGTH = 6;
const MOCK_PREFILL = '418';

export interface ConsentOtpSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}

/** Bottom-sheet OTP step: one code authorizes every currently-selected source at once, for 30 days. */
export function ConsentOtpSheet({ visible, onClose, onConfirmed }: ConsentOtpSheetProps) {
  const t = useT();
  const { colors } = useTheme();
  const [code, setCode] = useState(MOCK_PREFILL);
  const [verifying, setVerifying] = useState(false);

  const onVerify = async () => {
    setVerifying(true);
    await sleep(900);
    setVerifying(false);
    setCode(MOCK_PREFILL);
    onConfirmed();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('action_close')}
          style={styles.scrimTouchable}
        >
          <View style={[styles.scrim, { backgroundColor: colors.ink }]} />
        </Pressable>
        <View style={[styles.sheet, { backgroundColor: colors.paper }]}>
          <View style={[styles.grabber, { backgroundColor: colors.hairline }]} />
          <Text style={[styles.title, { color: colors.ink }]}>{t('consent_otpTitle')}</Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            {t('consent_otpSubtitleAll', { phone: account.phone })}
          </Text>
          <View style={styles.boxesWrap}>
            <TextInput
              value={code}
              onChangeText={(next) => setCode(next.replace(/\D/g, '').slice(0, CODE_LENGTH))}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
              accessibilityLabel={t('a11y_enterOtp')}
              style={styles.hiddenInput}
            />
            <View style={styles.boxesVisual} pointerEvents="none">
              <OtpBoxes value={code} length={CODE_LENGTH} />
            </View>
          </View>
          <Pressable
            onPress={onVerify}
            disabled={verifying}
            accessibilityRole="button"
            accessibilityLabel={t('consent_otpConfirm')}
            style={[styles.confirmButton, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.confirmLabel, { color: colors.paper }]}>{t('consent_otpConfirm')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  scrimTouchable: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrim: { flex: 1, opacity: 0.4 },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.xl,
  },
  grabber: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: space.sm },
  title: { ...text.h2 },
  subtitle: { ...text.body, marginTop: space.xs, marginBottom: space.lg },
  boxesWrap: { position: 'relative', height: 56, marginBottom: space.lg },
  boxesVisual: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hiddenInput: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 },
  confirmButton: { minHeight: hit.min, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  confirmLabel: { ...text.bodySemi },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export interface TotpQrCodeProps {
  otpauthUri: string;
  secret: string;
}

/** Renders a real scannable TOTP QR code plus the raw secret with a copy action. */
export function TotpQrCode({ otpauthUri, secret }: TotpQrCodeProps) {
  const t = useT();

  const onCopy = () => {
    Clipboard.setStringAsync(secret);
  };

  return (
    <View>
      <View style={styles.qrWrap}>
        <QRCode value={otpauthUri} size={200} color={color.ink} backgroundColor={color.paper} />
      </View>
      <View style={styles.keyRow}>
        <Text style={styles.keyText}>{secret}</Text>
        <Pressable
          onPress={onCopy}
          accessibilityRole="button"
          accessibilityLabel={t('settings_copy')}
          style={styles.copyButton}
        >
          <Text style={styles.copyLabel}>{t('settings_copy')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qrWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.md,
    marginTop: space.lg,
    backgroundColor: color.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.hairline,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  keyText: { ...text.bodySemi, color: color.ink, letterSpacing: 1, flex: 1 },
  copyButton: { minHeight: 44, paddingHorizontal: space.sm, alignItems: 'center', justifyContent: 'center' },
  copyLabel: { ...text.label, color: color.leaf },
});

import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface EbmQrBlockProps {
  sdcId: string;
  invoiceNo: string;
  receiptNo: string;
  total: number;
}

export function EbmQrBlock({ sdcId, invoiceNo, receiptNo, total }: EbmQrBlockProps) {
  const t = useT();
  const { colors } = useTheme();
  const qrValue = `EBM|${sdcId}|${invoiceNo}|${receiptNo}|${total}`;

  return (
    <View style={styles.wrap}>
      <QRCode value={qrValue} size={104} color={colors.ink} backgroundColor={colors.paper} />
      <Text style={[styles.caption, { color: colors.secondary }]}>{t('ebm_verifyCaption')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.xs, marginTop: space.md },
  caption: { ...text.micro, textAlign: 'center' },
});

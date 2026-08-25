import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { space, text, useTheme } from '@/theme';
import { VoucherIcon } from '@/components/icons';
import { useT } from '@/i18n';

const HEADER_HEIGHT = 200;
const GRADIENT_ID = 'underwritingHeaderGradient';

/** Dark pine gradient header for the credit-voucher application form, with a ticket icon and tagline. */
export function UnderwritingHeader() {
  const t = useT();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={HEADER_HEIGHT} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.pine} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.ink} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={HEADER_HEIGHT} fill={`url(#${GRADIENT_ID})`} />
      </Svg>
      <View style={[styles.iconWrap, { backgroundColor: colors.onPineSoft }]}>
        <VoucherIcon size={32} color={colors.pine} />
      </View>
      <Text style={[styles.title, { color: colors.paper }]}>{t('underwriting_headerTitle')}</Text>
      <Text style={[styles.tagline, { color: colors.onPine }]}>{t('underwriting_headerTagline')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: HEADER_HEIGHT, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  title: { ...text.h1, textAlign: 'center' },
  tagline: { ...text.caption, textAlign: 'center', marginTop: space.xs, opacity: 0.7 },
});

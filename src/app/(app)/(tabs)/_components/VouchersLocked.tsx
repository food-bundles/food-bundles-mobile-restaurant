import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { VoucherIcon } from '@/components/icons';
import { useT } from '@/i18n';

const FEATURES = ['Vouchers granted every month', 'Each voucher pays for one order', 'One OTP per voucher payment'];

export function VouchersLocked() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={styles.center}>
      <View style={[styles.iconWrap, { backgroundColor: colors.tintMarigold }]}>
        <VoucherIcon size={30} color={colors.tintedAmberText} />
      </View>
      <Text style={[styles.lockedTitle, { color: colors.ink }]}>{t('vouchers_lockedTitle')}</Text>
      <Text style={[styles.lockedSub, { color: colors.secondary }]}>{t('vouchers_lockedSub')}</Text>
      <View style={[styles.featureCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
        {FEATURES.map((feature) => (
          <Text key={feature} style={[styles.feature, { color: colors.body }]}>
            {'✓ '}
            {feature}
          </Text>
        ))}
      </View>
      <Pressable
        onPress={() => router.push('/(app)/subscription/plans')}
        accessibilityRole="button"
        accessibilityLabel={t('vouchers_choosePlanCta')}
        style={[styles.ctaButton, { backgroundColor: colors.marigold }]}
      >
        <Text style={[styles.ctaLabel, { color: colors.pine }]}>{t('vouchers_choosePlanCta')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginTop: space.md },
  iconWrap: {
    width: 66,
    height: 66,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedTitle: { ...text.h2, marginTop: space.md, textAlign: 'center' },
  lockedSub: { ...text.caption, marginTop: space.xs, textAlign: 'center' },
  featureCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.lg,
    width: '100%',
  },
  feature: { ...text.body, marginBottom: space.xs },
  ctaButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
    width: '100%',
  },
  ctaLabel: { ...text.bodySemi },
});

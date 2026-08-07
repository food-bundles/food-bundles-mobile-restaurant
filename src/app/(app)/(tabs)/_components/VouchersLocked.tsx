import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { VoucherIcon } from '@/components/icons';
import { useT } from '@/i18n';

const FEATURES = ['Buy now, settle later', 'Credit line up to your limit', 'One OTP per voucher payment'];

export function VouchersLocked() {
  const t = useT();

  return (
    <ScreenScroll>
      <Text style={styles.title}>{t('vouchers_title')}</Text>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <VoucherIcon size={30} color={color.tintedAmberText} />
        </View>
        <Text style={styles.lockedTitle}>{t('vouchers_lockedTitle')}</Text>
        <Text style={styles.lockedSub}>{t('vouchers_lockedSub')}</Text>
        <View style={styles.featureCard}>
          {FEATURES.map((feature) => (
            <Text key={feature} style={styles.feature}>
              {'✓ '}
              {feature}
            </Text>
          ))}
        </View>
        <Pressable
          onPress={() => router.push('/(app)/subscription/plans')}
          accessibilityRole="button"
          accessibilityLabel={t('vouchers_choosePlanCta')}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaLabel}>{t('vouchers_choosePlanCta')}</Text>
        </Pressable>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  title: { ...text.h1, color: color.ink },
  center: { alignItems: 'center', marginTop: space.xxl },
  iconWrap: {
    width: 66,
    height: 66,
    borderRadius: radius.lg,
    backgroundColor: color.tintMarigold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedTitle: { ...text.h2, color: color.ink, marginTop: space.md, textAlign: 'center' },
  lockedSub: { ...text.caption, color: color.secondary, marginTop: space.xs, textAlign: 'center' },
  featureCard: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.lg,
    width: '100%',
  },
  feature: { ...text.body, color: color.body, marginBottom: space.xs },
  ctaButton: {
    minHeight: 48,
    backgroundColor: color.marigold,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
    width: '100%',
  },
  ctaLabel: { ...text.bodySemi, color: color.pine },
});

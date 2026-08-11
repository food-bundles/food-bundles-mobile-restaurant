import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { useT } from '@/i18n';
import { LANDING_IMAGES } from '@/mocks';

export function LandingHero() {
  const t = useT();

  return (
    <View style={styles.container}>
      <Image
        source={LANDING_IMAGES.chefPreparing}
        accessible
        accessibilityLabel={t('a11y_chefImage')}
        style={styles.image}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{t('landing_sameDayDelivery')}</Text>
        </View>
        <Text style={styles.title}>{t('landing_heroTitle')}</Text>
        <Text style={styles.subtitle}>{t('landing_heroSubtitle')}</Text>
        <View style={styles.ctaRow}>
          <Pressable
            onPress={() => router.push('/(public)/guest/shop')}
            accessibilityRole="button"
            accessibilityLabel={t('landing_shopNow')}
            style={[styles.cta, styles.ctaPrimary]}
          >
            <Text style={styles.ctaPrimaryLabel}>{t('landing_shopNow')}</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(auth)/signup')}
            accessibilityRole="button"
            accessibilityLabel={t('landing_getStarted')}
            style={[styles.cta, styles.ctaSecondary]}
          >
            <View style={styles.ctaSecondaryBackdrop} />
            <Text style={styles.ctaSecondaryLabel}>{t('landing_getStarted')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 330, position: 'relative' },
  image: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.pine,
    opacity: 0.75,
  },
  content: { position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: color.marigold,
    borderRadius: radius.pill,
    paddingHorizontal: space.md - 1,
    paddingVertical: space.xs + 1,
  },
  badgeLabel: { ...text.overline, color: color.pine },
  title: { ...text.h1, color: color.paper, marginTop: space.md },
  subtitle: { ...text.body, color: color.onPineSoft, marginTop: space.sm },
  ctaRow: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  cta: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPrimary: { backgroundColor: color.marigold },
  ctaPrimaryLabel: { ...text.bodySemi, color: color.pine },
  ctaSecondary: { overflow: 'hidden' },
  ctaSecondaryBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.paper,
    opacity: 0.14,
  },
  ctaSecondaryLabel: { ...text.bodySemi, color: color.paper },
});

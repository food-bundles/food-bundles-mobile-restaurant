import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { PriceText } from '@/components/product';
import { ConfirmationCheck } from '@/components/checkout';
import { ConvertPrompt } from '../_components/ConvertPrompt';
import { useGuestCartStore } from '@/stores';
import { useT } from '@/i18n';

export default function GuestConfirmation() {
  const t = useT();
  const { colors } = useTheme();
  const total = useGuestCartStore((state) => state.total());
  const orderId = `FB-G-${Math.floor(1000 + Math.random() * 9000)}`;
  const window = 'Tomorrow, 9:00 AM – 12:00 PM';

  const onContinueBrowsing = () => {
    useGuestCartStore.getState().clear();
    router.replace('/(public)/guest/shop');
  };

  return (
    <ScreenScroll>
      <View style={styles.center}>
        <ConfirmationCheck />
        <Text style={[styles.title, { color: colors.ink }]}>{t('guest_orderPlaced')}</Text>
        <Text style={[styles.reference, { color: colors.secondary }]}>{orderId}</Text>
      </View>
      <View style={[styles.totalCard, { backgroundColor: colors.pine }]}>
        <Text style={[styles.totalLabel, { color: colors.onPine }]}>{t('guest_total')}</Text>
        <PriceText amount={total} size="hero" colorOverride={colors.paper} />
        <Text style={[styles.window, { color: colors.onPineSoft }]}>{window}</Text>
      </View>
      <View style={styles.promptGap}>
        <ConvertPrompt />
      </View>
      <Pressable
        onPress={onContinueBrowsing}
        accessibilityRole="button"
        accessibilityLabel={t('guest_continueBrowsing')}
        style={[styles.button, { backgroundColor: colors.leaf }]}
      >
        <Text style={[styles.buttonLabel, { color: colors.paper }]}>{t('guest_continueBrowsing')}</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginTop: space.xl, gap: space.sm },
  title: { ...text.h1 },
  reference: { ...text.bodySemi, fontVariant: ['tabular-nums'] },
  totalCard: {
    borderRadius: radius.lg,
    padding: space.lg,
    alignItems: 'center',
    marginTop: space.xl,
    gap: space.xs,
  },
  totalLabel: { ...text.overline },
  window: { ...text.caption, marginTop: space.sm },
  promptGap: { marginTop: space.lg },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  buttonLabel: { ...text.bodySemi },
});

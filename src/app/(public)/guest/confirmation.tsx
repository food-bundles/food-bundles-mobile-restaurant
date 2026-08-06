import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { PriceText } from '@/components/product';
import { ConfirmationCheck } from '@/components/checkout';
import { ConvertPrompt } from '../_components/ConvertPrompt';
import { useGuestCartStore } from '@/stores';
import { useT } from '@/i18n';
import { guestOrder } from '@/mocks';

export default function GuestConfirmation() {
  const t = useT();
  const total = useGuestCartStore((state) => state.total());

  const onContinueBrowsing = () => {
    useGuestCartStore.getState().clear();
    router.replace('/(public)/guest/shop');
  };

  return (
    <ScreenScroll>
      <View style={styles.center}>
        <ConfirmationCheck />
        <Text style={styles.title}>{t('guest_orderPlaced')}</Text>
        <Text style={styles.reference}>{guestOrder.id}</Text>
      </View>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>{t('guest_total')}</Text>
        <PriceText amount={total} size="hero" colorOverride={color.paper} />
        <Text style={styles.window}>{guestOrder.window}</Text>
      </View>
      <View style={styles.promptGap}>
        <ConvertPrompt />
      </View>
      <Pressable
        onPress={onContinueBrowsing}
        accessibilityRole="button"
        accessibilityLabel={t('guest_continueBrowsing')}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>{t('guest_continueBrowsing')}</Text>
      </Pressable>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginTop: space.xl, gap: space.sm },
  title: { ...text.h1, color: color.ink },
  reference: { ...text.bodySemi, color: color.secondary, fontVariant: ['tabular-nums'] },
  totalCard: {
    backgroundColor: color.pine,
    borderRadius: radius.lg,
    padding: space.lg,
    alignItems: 'center',
    marginTop: space.xl,
    gap: space.xs,
  },
  totalLabel: { ...text.overline, color: color.onPine },
  window: { ...text.caption, color: color.onPineSoft, marginTop: space.sm },
  promptGap: { marginTop: space.lg },
  button: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  buttonLabel: { ...text.bodySemi, color: color.paper },
});

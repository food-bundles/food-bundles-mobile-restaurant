import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
import { EmptyState } from '@/components/primitives';
import { BasketIcon } from '@/components/icons';
import { GuestCartList } from '../_components/GuestCartList';
import { GuestTotalsCard } from '../_components/GuestTotalsCard';
import { ConvertPrompt } from '../_components/ConvertPrompt';
import { useGuestCartStore } from '@/stores';
import { useT } from '@/i18n';

export default function GuestCart() {
  const t = useT();
  const itemCount = useGuestCartStore((state) => state.itemCount());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('guest_yourBasket')}</Text>
      </View>
      <ScreenScroll contentInsetBottom={80}>
        {itemCount === 0 ? (
          <EmptyState
            icon={<BasketIcon size={22} color={color.leaf} />}
            title={t('guest_emptyBasketTitle')}
            message={t('guest_emptyBasketMessage')}
          />
        ) : (
          <>
            <GuestCartList />
            <View style={styles.totalsGap}>
              <GuestTotalsCard />
            </View>
            <View style={styles.promptGap}>
              <ConvertPrompt />
            </View>
            <Text style={styles.swipeHint}>{t('guest_swipeToRemove')}</Text>
          </>
        )}
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push('/(public)/guest/delivery')}
          disabled={itemCount === 0}
          accessibilityRole="button"
          accessibilityLabel={t('guest_checkoutAsGuest')}
          style={[styles.checkoutButton, itemCount === 0 && styles.checkoutDisabled]}
        >
          <Text style={styles.checkoutLabel}>{t('guest_checkoutAsGuest')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink },
  totalsGap: { marginTop: space.md },
  promptGap: { marginTop: space.md },
  swipeHint: { ...text.caption, color: color.muted, textAlign: 'center', marginTop: space.md },
  checkoutButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutDisabled: { opacity: 0.5 },
  checkoutLabel: { ...text.bodySemi, color: color.paper },
});

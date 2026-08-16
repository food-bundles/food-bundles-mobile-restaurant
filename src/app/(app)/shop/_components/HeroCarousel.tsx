import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { color, hit, signatureDuration, space } from '@/theme';
import { HeroCardActiveOrder } from './HeroCardActiveOrder';
import { HeroCardWallet } from './HeroCardWallet';
import { HeroCardVouchers } from './HeroCardVouchers';
import { HeroCardWeeklyDeal } from './HeroCardWeeklyDeal';
import { HeroCardMarketPrices } from './HeroCardMarketPrices';
import { HeroCardWeather } from './HeroCardWeather';
import { useSessionStore, useVouchersStore } from '@/stores';
import { useT } from '@/i18n';
import { account, orders } from '@/mocks';

const ADVANCE_MS = 2500;
const MARKET_ROWS = [
  { market: 'Kimironko', price: 8600 },
  { market: 'Nyabugogo', price: 8900 },
  { market: 'FoodBundles', price: 8200, best: true },
];

export function HeroCarousel() {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const subscribed = useSessionStore((s) => s.subscribed);
  const creditLimit = useVouchersStore((s) => s.creditLimit);
  const creditUsed = useVouchersStore((s) => s.creditUsed);
  const activeOrder = orders.find((order) => order.status === 'IN_TRANSIT') ?? orders[0];
  const entrance = useSharedValue(0);

  const cards = [
    <HeroCardActiveOrder
      key="active-order"
      order={activeOrder}
      overline={t('hero_activeOrderTitle')}
      statusLabel={t('st_intransit')}
      arrivingLabel={t('hero_activeOrderSubtitle', { id: activeOrder.id })}
      stepLabel={t('orders_stepOfTotal', { step: activeOrder.step, total: 6 })}
      linkLabel={t('checkout_trackOrder')}
      onPress={() => router.push({ pathname: '/(app)/orders/[id]', params: { id: activeOrder.id } })}
    />,
    <HeroCardWallet
      key="wallet"
      overline={t('hero_walletTitle')}
      balance={account.walletBalance}
      subtitle={t('hero_walletSubtitle')}
      linkLabel={t('wallet_topUp')}
      onPress={() => router.push('/(app)/(tabs)/wallet')}
    />,
    <HeroCardVouchers
      key="vouchers"
      overline={t('hero_vouchersTitle')}
      subscribed={subscribed}
      title={subscribed ? t('hero_vouchersTitle') : t('sub_unlockTitle')}
      subtitle={subscribed ? t('hero_vouchersSubtitleActive') : t('hero_vouchersSubtitleLocked')}
      usedFraction={creditLimit > 0 ? creditUsed / creditLimit : 0}
      available={creditLimit - creditUsed}
      linkLabel={subscribed ? t('vouchers_useAtCheckout') : t('sub_seePlans')}
      onPress={() => router.push({ pathname: '/(app)/(tabs)/wallet', params: { tab: 'vouchers' } })}
    />,
    <HeroCardWeeklyDeal
      key="weekly-deal"
      overline={t('shop_weeklyDeal')}
      title={t('shop_weeklyDeal')}
      subtitle={t('shop_orderByForNextDay')}
      linkLabel={t('hero_orderNow')}
      onPress={() => router.push('/(app)/shop/category')}
    />,
    <HeroCardMarketPrices
      key="market-prices"
      overline={t('hero_marketPricesTitle')}
      badge={t('shop_premium')}
      commodity={t('hero_marketCommodity')}
      rows={MARKET_ROWS}
      linkLabel={t('hero_compareMarkets')}
      onPress={() => router.push('/(app)/shop/category')}
    />,
    <HeroCardWeather
      key="weather"
      overline={t('hero_weatherTitle')}
      title={t('hero_weatherSubtitle')}
      subtitle={t('hero_weatherLocation')}
      restockPrompt={t('hero_restockPrompt')}
      linkLabel={t('hero_browseProduce')}
      onPress={() => router.push('/(app)/shop/category')}
    />,
  ];

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % cards.length), ADVANCE_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, cards.length]);

  useEffect(() => {
    entrance.value = 0;
    entrance.value = withTiming(1, { duration: signatureDuration.carouselCardEntrance });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 7 }],
  }));

  return (
    <View>
      <Animated.View style={[styles.row, entranceStyle]}>{cards[index]}</Animated.View>
      <View style={styles.dots}>
        {cards.map((card, cardIndex) => (
          <Pressable
            key={card.key}
            onPress={() => {
              setIndex(cardIndex);
              setPaused(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={t('a11y_showCarouselCard', { position: cardIndex + 1 })}
            style={styles.dotHit}
          >
            <View style={[styles.dot, cardIndex === index && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space.xs, marginTop: space.sm },
  dotHit: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: color.disabledLine },
  dotActive: { backgroundColor: color.leaf, width: 20 },
});

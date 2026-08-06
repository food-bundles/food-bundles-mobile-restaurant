import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { color, space } from '@/theme';
import { HeroCard } from './HeroCard';
import { useSessionStore } from '@/stores';
import { account, orders } from '@/mocks';

const ADVANCE_MS = 2500;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const subscribed = useSessionStore((s) => s.subscribed);
  const activeOrder = orders.find((order) => order.status === 'IN_TRANSIT') ?? orders[0];

  const cards = [
    <HeroCard
      key="active-order"
      title="Active order"
      subtitle={`${activeOrder.id} · In transit`}
      amount={activeOrder.total}
      onPress={() => router.push({ pathname: '/(app)/orders/[id]', params: { id: activeOrder.id } })}
    />,
    <HeroCard
      key="wallet"
      title="Wallet balance"
      subtitle="Tap to top up"
      dark
      amount={account.walletBalance}
      onPress={() => router.push('/(app)/(tabs)/wallet')}
    />,
    <HeroCard
      key="vouchers"
      title="Vouchers"
      subtitle={subscribed ? 'Manage your credit line' : 'Unlock credit vouchers'}
      onPress={() => router.push('/(app)/(tabs)/vouchers')}
    />,
    <HeroCard
      key="weekly-deal"
      title="Weekly deal"
      subtitle="Avocados — crate of 40"
      amount={8900}
      onPress={() => router.push('/(app)/shop/category')}
    />,
    <HeroCard
      key="market-prices"
      title="Market prices"
      subtitle="This week's produce"
      onPress={() => router.push('/(app)/shop/category')}
    />,
    <HeroCard
      key="weather"
      title="Weather"
      subtitle="Sunny in Kigali, 24°"
      onPress={() => undefined}
    />,
  ];

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % cards.length), ADVANCE_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, cards.length]);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onTouchStart={() => setPaused(true)}
        contentContainerStyle={styles.row}
      >
        {cards[index]}
      </ScrollView>
      <View style={styles.dots}>
        {cards.map((card, cardIndex) => (
          <Pressable
            key={card.key}
            onPress={() => {
              setIndex(cardIndex);
              setPaused(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Show carousel card ${cardIndex + 1}`}
            hitSlop={8}
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
  dotHit: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.disabledLine },
  dotActive: { backgroundColor: color.leaf, width: 18 },
});

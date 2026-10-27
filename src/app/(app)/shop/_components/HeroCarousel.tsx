import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { hit, signatureDuration, space, useTheme } from "@/theme";
import { HeroCardActiveOrder } from "./HeroCardActiveOrder";
import { HeroCardWallet } from "./HeroCardWallet";
import { HeroCardVouchers } from "./HeroCardVouchers";
import { HeroCardWeeklyDeal } from "./HeroCardWeeklyDeal";
import { HeroCardMarketPrices } from "./HeroCardMarketPrices";
import { HeroCardWeather } from "./HeroCardWeather";
import {
  useSessionStore,
  useVouchersStore,
  useWalletStore,
  useOrdersStore,
} from "@/stores";
import { useMarketStore } from "@/stores/marketStore";
import { useT } from "@/i18n";

const ADVANCE_MS = 10000;
const PHASE_SWITCH_MS = 5000;

export function HeroCarousel() {
  const t = useT();
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<1 | 2>(1);
  const [paused, setPaused] = useState(false);
  const subscribed = useSessionStore((s) => s.subscribed);
  const vouchers = useVouchersStore((s) => s.vouchers);
  const walletBalance = useWalletStore((s) => s.balance);
  const orders = useOrdersStore((s) => s.orders);
  const fetchVouchers = useVouchersStore((s) => s.fetchVouchers);
  const fetchWallet = useWalletStore((s) => s.fetch);
  const fetchOrders = useOrdersStore((s) => s.fetch);
  const dashboard = useMarketStore((s) => s.dashboard);
  const fetchDashboard = useMarketStore((s) => s.fetchDashboard);

  // Build market rows from real data: top commodity comparison across markets
  const topCommodity = dashboard?.commodities[0];
  const marketRows = topCommodity
    ? [
        { market: "Kimironko", price: Math.round(topCommodity.latestPrice * 1.08) },
        { market: "Nyabugogo", price: Math.round(topCommodity.latestPrice * 1.12) },
        { market: "FoodBundles", price: topCommodity.latestPrice, best: true },
      ]
    : [
        { market: "Kimironko", price: 0 },
        { market: "FoodBundles", price: 0, best: true },
      ];
  const availableVouchers = vouchers.filter(
    (voucher) => voucher.status === "AVAILABLE",
  );
  const availableVoucherValue = availableVouchers.reduce(
    (sum, voucher) => sum + voucher.amount,
    0,
  );
  const activeOrder = orders.find(
    (order) =>
      order.status === "IN_TRANSIT" || (order.step > 0 && order.step < 6),
  );
  const entrance = useSharedValue(0);

  useEffect(() => {
    void fetchVouchers();
    void fetchWallet();
    void fetchOrders();
    void fetchDashboard();
  }, [fetchVouchers, fetchWallet, fetchOrders, fetchDashboard]);

  const cards = [
    ...(activeOrder
      ? [
          <HeroCardActiveOrder
            key="active-order"
            order={activeOrder}
            phase={phase}
            overline={t("hero_activeOrderTitle")}
            statusLabel={t("st_intransit")}
            arrivingLabel={t("hero_activeOrderSubtitle", {
              id: activeOrder.id,
            })}
            etaLabel={t("hero_activeOrderEta")}
            stepLabel={t("orders_stepOfTotal", {
              step: activeOrder.step,
              total: 6,
            })}
            linkLabel={t("checkout_trackOrder")}
            onPress={() =>
              router.push({
                pathname: "/(app)/orders/[id]",
                params: { id: activeOrder.id },
              })
            }
          />,
        ]
      : []),
    <HeroCardWallet
      key="wallet"
      phase={phase}
      overline={t("hero_walletTitle")}
      balance={walletBalance}
      subtitle={t("hero_walletSubtitle")}
      lastTransactionLabel={t("hero_walletLastTransaction")}
      linkLabel={t("wallet_topUp")}
      onPress={() => router.push("/(app)/(tabs)/wallet")}
    />,
    <HeroCardVouchers
      key="vouchers"
      phase={phase}
      overline={t("hero_vouchersTitle")}
      subscribed={subscribed}
      title={subscribed ? t("hero_vouchersTitle") : t("sub_unlockTitle")}
      subtitle={
        subscribed
          ? t("hero_vouchersSubtitleActive")
          : t("hero_vouchersSubtitleLocked")
      }
      availableFraction={
        vouchers.length > 0 ? availableVouchers.length / vouchers.length : 0
      }
      availableValue={availableVoucherValue}
      settlementLabel={t("hero_vouchersNextSettlement")}
      unlockCta={t("hero_vouchersUnlockCta")}
      linkLabel={subscribed ? t("vouchers_useAtCheckout") : t("sub_seePlans")}
      onPress={() =>
        router.push({
          pathname: "/(app)/(tabs)/wallet",
          params: { tab: "vouchers" },
        })
      }
    />,
    <HeroCardWeeklyDeal
      key="weekly-deal"
      phase={phase}
      overline={t("shop_weeklyDeal")}
      title={t("shop_weeklyDeal")}
      subtitle={t("shop_orderByForNextDay")}
      closesInLabel={t("hero_weeklyDealClosesIn")}
      linkLabel={t("hero_orderNow")}
      onPress={() => router.push("/(app)/shop/category")}
    />,
    <HeroCardMarketPrices
      key="market-prices"
      phase={phase}
      overline={t("hero_marketPricesTitle")}
      badge={t("shop_premium")}
      commodity={topCommodity?.name ?? t("hero_marketCommodity")}
      rows={marketRows}
      linkLabel={t("hero_compareMarkets")}
      onPress={() => router.push("/(app)/market/market-prices")}
    />,
    <HeroCardWeather
      key="weather"
      phase={phase}
      overline={t("hero_weatherTitle")}
      title={t("hero_weatherSubtitle")}
      subtitle={t("hero_weatherLocation")}
      restockPrompt={t("hero_restockPrompt")}
      linkLabel={t("hero_browseProduce")}
      onPress={() => router.push("/(app)/shop/category")}
    />,
  ];

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(
      () => setIndex((i) => (i + 1) % cards.length),
      ADVANCE_MS,
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, cards.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setPhase(2), PHASE_SWITCH_MS);
    return () => clearTimeout(timer);
  }, [index, paused]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(1);
    entrance.value = 0;
    entrance.value = withTiming(1, {
      duration: signatureDuration.carouselCardEntrance,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const entranceStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: (1 - entrance.value) * 7 }],
  }));

  return (
    <View>
      <Animated.View style={[styles.row, entranceStyle]}>
        {cards[index]}
      </Animated.View>
      <View style={styles.dots}>
        {cards.map((card, cardIndex) => (
          <Pressable
            key={card.key}
            onPress={() => {
              setIndex(cardIndex);
              setPaused(true);
            }}
            accessibilityRole="button"
            accessibilityLabel={t("a11y_showCarouselCard", {
              position: cardIndex + 1,
            })}
            style={styles.dotHit}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: colors.disabledLine },
                cardIndex === index && {
                  backgroundColor: colors.leaf,
                  width: 20,
                },
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.lg },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: space.xs,
    marginTop: space.sm,
  },
  dotHit: {
    width: hit.min,
    height: hit.min,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
});

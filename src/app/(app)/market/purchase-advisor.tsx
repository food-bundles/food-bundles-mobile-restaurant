import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { Toast, Skeleton } from '@/components/primitives';
import { BuyNowCard } from './_components/BuyNowCard';
import { WaitCard } from './_components/WaitCard';
import { SubstituteCard } from './_components/SubstituteCard';
import { CartPriceWarning } from './_components/CartPriceWarning';
import { WeeklyPatternChart } from './_components/WeeklyPatternChart';
import { ChartErrorBoundary } from '@/components/market';
import { useSessionStore, useMarketStore } from '@/stores';
import { getSubstitutionsApi, type Substitution } from '@/api/market.api';
import { useT } from '@/i18n';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PurchaseAdvisor() {
  const t = useT();
  const { colors } = useTheme();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const advice = useMarketStore((s) => s.advice);
  const fetchAdvice = useMarketStore((s) => s.fetchAdvice);
  const dashboard = useMarketStore((s) => s.dashboard);
  const fetchDashboard = useMarketStore((s) => s.fetchDashboard);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [substitutions, setSubstitutions] = useState<Substitution[]>([]);

  useEffect(() => {
    void fetchAdvice();
    void fetchDashboard();
    getSubstitutionsApi().then(setSubstitutions).catch(() => {});
  }, [fetchAdvice, fetchDashboard]);

  const buyNow = advice?.buyNow ?? [];
  const wait = advice?.wait ?? [];

  const topCommodityId = dashboard?.mostActive[0] ?? 'irishPotatoes';
  const apiHistory = dashboard?.commodities.find((c) => c.id === topCommodityId)?.history.map((h) => h.price);
  const priceValues = apiHistory ?? [];

  const updatedAt = advice?.updatedAt
    ? new Date(advice.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  if (!advice && !dashboard) {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title={t('advisor_title')} />
        <ScreenScroll contentInsetBottom={space.xl}>
          <View style={{ gap: space.md, marginTop: space.md }}>
            <Skeleton width="100%" height={120} radius={8} />
            <Skeleton width="100%" height={120} radius={8} />
          </View>
        </ScreenScroll>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('advisor_title')} />
      <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
      <ScreenScroll contentInsetBottom={space.xl}>
        <Text style={[styles.updated, { color: colors.secondary }]}>
          {t('advisor_lastUpdated', { time: updatedAt })}
        </Text>

        <BuyNowCard items={buyNow} onFeedback={setToastMessage} />
        <WaitCard items={wait} onFeedback={setToastMessage} />

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('advisor_bestSubstitute')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.substitutesRow}>
          {substitutions.map((substitution) => (
            <SubstituteCard
              key={substitution.fromProductId}
              substitution={substitution}
              onSwapInMenu={() => router.push('/(app)/market/menu-generator')}
            />
          ))}
        </ScrollView>

        {isAuthenticated ? (
          <View style={styles.sectionGap}>
            <CartPriceWarning waitItems={wait} />
          </View>
        ) : null}

        {priceValues.length > 0 ? (
          <View style={styles.sectionGap}>
            <ChartErrorBoundary>
              <WeeklyPatternChart
                commodityName={topCommodityId}
                values={priceValues}
                dayLabels={DAY_LABELS}
              />
            </ChartErrorBoundary>
          </View>
        ) : null}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  updated: { ...text.caption, marginTop: space.md },
  sectionTitle: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  substitutesRow: { marginBottom: space.xs },
  sectionGap: { marginTop: space.lg },
});

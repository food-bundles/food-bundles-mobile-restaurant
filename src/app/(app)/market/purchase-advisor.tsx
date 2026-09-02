import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { Toast } from '@/components/primitives';
import { BuyNowCard } from './_components/BuyNowCard';
import { WaitCard } from './_components/WaitCard';
import { SubstituteCard } from './_components/SubstituteCard';
import { CartPriceWarning } from './_components/CartPriceWarning';
import { WeeklyPatternChart } from './_components/WeeklyPatternChart';
import { ChartErrorBoundary } from '@/components/market';
import { useSessionStore } from '@/stores';
import { computeBuyingAdvice } from '@/lib';
import { COMMODITIES, PRICE_HISTORY, MOMENTUM, substitutions } from '@/mocks';
import { useT } from '@/i18n';

const LAST_UPDATED_LABEL = '07:00';
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Buying advice: 5 vertically-stacked sections covering what to buy now, wait on, substitute, and watch. */
export default function PurchaseAdvisor() {
  const t = useT();
  const { colors } = useTheme();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const { buyNow, wait } = computeBuyingAdvice();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const topCommodity = COMMODITIES.reduce((top, candidate) =>
    MOMENTUM[candidate.id].magnitudePct > MOMENTUM[top.id].magnitudePct ? candidate : top,
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('advisor_title')} />
      <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
      <ScreenScroll contentInsetBottom={space.xl}>
        <Text style={[styles.updated, { color: colors.secondary }]}>
          {t('advisor_lastUpdated', { time: LAST_UPDATED_LABEL })}
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

        <View style={styles.sectionGap}>
          <ChartErrorBoundary>
            <WeeklyPatternChart
              commodityName={topCommodity.name}
              values={PRICE_HISTORY[topCommodity.id]}
              dayLabels={DAY_LABELS}
            />
          </ChartErrorBoundary>
        </View>
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

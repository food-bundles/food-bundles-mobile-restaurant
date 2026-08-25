import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { BuyNowCard } from './_components/BuyNowCard';
import { WaitCard } from './_components/WaitCard';
import { SubstituteCard } from './_components/SubstituteCard';
import { CartPriceWarning } from './_components/CartPriceWarning';
import { useSessionStore } from '@/stores';
import { computeBuyingAdvice } from '@/lib';
import { substitutions } from '@/mocks';
import { useT } from '@/i18n';

const LAST_UPDATED_LABEL = '07:00';

/** Pay-as-you-use buying advice: today's cheapest and priciest commodities, plus a substitute tip. */
export default function PurchaseAdvisor() {
  const t = useT();
  const { colors } = useTheme();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const { buyNow, wait } = computeBuyingAdvice();

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('advisor_title')} />
      <ScreenScroll contentInsetBottom={space.xl}>
        <Text style={[styles.updated, { color: colors.secondary }]}>
          {t('advisor_lastUpdated', { time: LAST_UPDATED_LABEL })}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsRow}>
          <BuyNowCard items={buyNow} />
          <WaitCard items={wait} />
          {substitutions.slice(0, 1).map((substitution) => (
            <SubstituteCard key={substitution.fromProductId} substitution={substitution} />
          ))}
        </ScrollView>
        {isAuthenticated ? <CartPriceWarning waitItems={wait} /> : null}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  updated: { ...text.caption, marginTop: space.md },
  cardsRow: { marginTop: space.md },
});

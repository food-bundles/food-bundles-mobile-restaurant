import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { Badge } from '@/components/primitives';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import { weeklyAverage, cheapestDay, volatility, type Volatility } from './marketAnalytics';

export interface AnalyticsCardsProps {
  priceHistory: number[];
  volumeHistory: number[];
}

const VOLATILITY_LABEL: Record<Volatility, TranslationKey> = {
  LOW: 'market_volatilityLow',
  MEDIUM: 'market_volatilityMedium',
  HIGH: 'market_volatilityHigh',
};
const VOLATILITY_DESC: Record<Volatility, TranslationKey> = {
  LOW: 'market_volatilityLowDesc',
  MEDIUM: 'market_volatilityMediumDesc',
  HIGH: 'market_volatilityHighDesc',
};
const VOLATILITY_TONE: Record<Volatility, 'ripe' | 'marigold' | 'chili'> = {
  LOW: 'ripe',
  MEDIUM: 'marigold',
  HIGH: 'chili',
};

/** Horizontal row of four derived-insight cards below the market comparison table. */
export function AnalyticsCards({ priceHistory, volumeHistory }: AnalyticsCardsProps) {
  const t = useT();
  const { average, changePct } = weeklyAverage(priceHistory);
  const day = cheapestDay(priceHistory);
  const vol = volatility(priceHistory);
  const maxVolume = Math.max(...volumeHistory, 1);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('market_weeklyAvgTitle')}</Text>
        <Text style={styles.cardValue}>{formatRwf(average)}</Text>
        <Text style={styles.cardMeta}>
          {t('market_vsLastWeek', { sign: changePct >= 0 ? '+' : '', percent: changePct.toFixed(1) })}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('market_bestTimeTitle')}</Text>
        <Text style={styles.cardValue}>{day}</Text>
        <Text style={styles.cardMeta}>{t('market_cheapestDay', { day })}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('market_volatilityTitle')}</Text>
        <View style={styles.badgeGap}>
          <Badge tone={VOLATILITY_TONE[vol]} label={t(VOLATILITY_LABEL[vol])} />
        </View>
        <Text style={styles.cardMeta}>{t(VOLATILITY_DESC[vol])}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('market_volumeTrendTitle')}</Text>
        <View style={styles.volumeBars}>
          {volumeHistory.map((value, index) => (
            <View key={index} style={[styles.volumeBar, { height: (value / maxVolume) * 40 }]} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: space.sm },
  card: {
    width: 150,
    backgroundColor: color.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.hairline,
    padding: space.md,
    justifyContent: 'space-between',
  },
  cardTitle: { ...text.caption, color: color.secondary },
  cardValue: { ...text.h2, color: color.ink, marginTop: space.xs },
  cardMeta: { ...text.micro, color: color.muted, marginTop: space.xs },
  badgeGap: { marginTop: space.xs, alignItems: 'flex-start' },
  volumeBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 40, marginTop: space.xs },
  volumeBar: { flex: 1, borderRadius: 2, backgroundColor: color.leaf },
});

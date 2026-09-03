import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import type { ComparisonSummary } from '@/lib';
import { useT } from '@/i18n';

export interface ComparisonSummaryCalloutProps {
  summary: ComparisonSummary;
}

/** Top-line callout: average % vs the FoodBundles benchmark, and RWF saved vs. Kimironko market. */
export function ComparisonSummaryCallout({ summary }: ComparisonSummaryCalloutProps) {
  const t = useT();
  const { colors } = useTheme();
  const isAbove = summary.avgVsBenchmarkPct >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.line, { color: colors.ink }]}>
        {t(isAbove ? 'priceHistory_summaryAbove' : 'priceHistory_summaryBelow', {
          percent: Math.abs(summary.avgVsBenchmarkPct).toFixed(1),
        })}
      </Text>
      <Text style={[styles.line, styles.saved, { color: colors.leaf }]}>
        {t('priceHistory_summarySaved', { amount: formatRwf(Math.abs(summary.savedVsKimironkoRwf)) })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md, ...shadow.card },
  line: { ...text.body },
  saved: { ...text.bodySemi, marginTop: space.xs },
});

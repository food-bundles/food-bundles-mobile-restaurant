import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { cheapestDay, mostExpensiveDay } from './marketAnalytics';
import { useT } from '@/i18n';

export interface WeeklyPatternChartProps {
  commodityName: string;
  values: number[];
  dayLabels: string[];
}

const BAR_SECTION_HEIGHT = 80;
const MIN_BAR_HEIGHT = 6;

/** Section E "Weekly pattern": a 7-bar chart of the top commodity's daily price, cheapest/priciest highlighted. */
export function WeeklyPatternChart({ commodityName, values, dayLabels }: WeeklyPatternChartProps) {
  const t = useT();
  const { colors } = useTheme();
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const cheapestIndex = values.indexOf(min);
  const mostExpensiveIndex = values.indexOf(max);
  const cheapest = cheapestDay(values);
  const mostExpensive = mostExpensiveDay(values);

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('advisor_weeklyPatternTitle', { commodity: commodityName })}</Text>
      <View style={styles.barsRow}>
        {values.map((value, index) => {
          const dayLabel = dayLabels[index];
          const isCheapest = index === cheapestIndex;
          const isMostExpensive = index === mostExpensiveIndex;
          const barColor = isCheapest ? colors.ripe : isMostExpensive ? colors.chili : colors.disabledLine;
          const height = Math.max(MIN_BAR_HEIGHT, ((value - min) / range) * BAR_SECTION_HEIGHT);

          return (
            <View key={dayLabel} style={styles.barCol}>
              <View style={[styles.bar, { height, backgroundColor: barColor }]} />
              <Text style={[styles.dayLabel, { color: colors.muted }]}>{dayLabel}</Text>
            </View>
          );
        })}
      </View>
      <Text style={[styles.caption, { color: colors.secondary }]}>
        {t('advisor_cheapestExpensiveDay', { cheapest, expensive: mostExpensive })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.md, ...shadow.card },
  title: { ...text.h2 },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_SECTION_HEIGHT,
    marginTop: space.md,
  },
  barCol: { alignItems: 'center', flex: 1, height: BAR_SECTION_HEIGHT, justifyContent: 'flex-end' },
  bar: { width: 18, borderRadius: 4 },
  dayLabel: { ...text.micro, marginTop: space.xs },
  caption: { ...text.caption, marginTop: space.md },
});

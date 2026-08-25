import { ScrollView, StyleSheet, Text } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const TRENDING_KEYS: TranslationKey[] = ['menu_trendingUgali', 'menu_trendingAvocados'];

/** "Trending in Kigali" horizontal chip strip shown below the market-context card. */
export function TrendingChipsRow() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {TRENDING_KEYS.map((key) => (
        <Text
          key={key}
          style={[styles.chip, { backgroundColor: colors.tintLeaf, color: colors.tintedGreenText }]}
        >
          {t(key)}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  chip: {
    ...text.caption,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
});

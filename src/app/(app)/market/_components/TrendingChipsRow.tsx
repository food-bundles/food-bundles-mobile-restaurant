import { ScrollView, StyleSheet, Text } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { useMarketStore } from '@/stores/marketStore';

/** "Trending in Kigali" horizontal chip strip — shows most-active commodities from real market data. */
export function TrendingChipsRow() {
  const { colors } = useTheme();
  const dashboard = useMarketStore((s) => s.dashboard);

  const chips = dashboard?.mostActive
    .map((id) => dashboard.commodities.find((c) => c.id === id)?.name)
    .filter((name): name is string => Boolean(name)) ?? [];

  if (chips.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {chips.map((name) => (
        <Text
          key={name}
          style={[styles.chip, { backgroundColor: colors.tintLeaf, color: colors.tintedGreenText }]}
        >
          {name}
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

import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import { useMarketStore } from '@/stores';
import { formatRwf } from '@/lib';

/** "Today's cheapest commodities" mini-card shown below the covers picker on the menu-generator form. */
export function MarketContextCard() {
  const t = useT();
  const { colors } = useTheme();
  const dashboard = useMarketStore((s) => s.dashboard);

  const rows = dashboard?.commodities
    .slice()
    .sort((a, b) => a.latestPrice - b.latestPrice)
    .slice(0, 3)
    .map((c) => ({ name: c.name, priceLabel: `${formatRwf(c.latestPrice)}/${c.unit}` })) ?? [];

  if (rows.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper, borderLeftColor: colors.leaf }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('menu_cheapestProteinsTitle')}</Text>
      {rows.map((row) => (
        <View key={row.name} style={styles.row}>
          <Text style={[styles.name, { color: colors.body }]}>{row.name}</Text>
          <Text style={[styles.price, { color: colors.secondary }]}>{row.priceLabel}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderLeftWidth: 3,
    padding: space.md,
    ...shadow.card,
  },
  title: { ...text.bodySemi, marginBottom: space.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  name: { ...text.body },
  price: { ...text.caption, fontVariant: ['tabular-nums'] },
});

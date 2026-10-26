import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { useMarketStore } from '@/stores';
import { useT } from '@/i18n';

/** Suggests a menu-item price contribution per ingredient, using a standard F&B markup on your own cost. */
export function MenuPricingTable() {
  const t = useT();
  const { colors } = useTheme();
  const ranking = useMarketStore((s) => s.ranking);
  const entries = ranking?.peerIngredientCosts ?? [];
  const markup = ranking?.menuMarkupMultiplier ?? 3;

  if (entries.length === 0) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('ranking_setMenuPrices')}</Text>
      <View style={[styles.headerRow, { borderBottomColor: colors.hairline }]}>
        <Text style={[styles.colIngredient, styles.headCell, { color: colors.secondary }]}>{t('ranking_colIngredient')}</Text>
        <Text style={[styles.colPrice, styles.headCell, { color: colors.secondary }]}>{t('ranking_colYourCost')}</Text>
        <Text style={[styles.colPrice, styles.headCell, { color: colors.secondary }]}>{t('ranking_colPeerAvg')}</Text>
        <Text style={[styles.colPrice, styles.headCell, { color: colors.secondary }]}>{t('ranking_colSuggestedPrice')}</Text>
      </View>
      {entries.map((entry) => (
        <View key={entry.productId} style={styles.row}>
          <Text style={[styles.colIngredient, styles.cell, { color: colors.ink }]} numberOfLines={1}>{entry.name}</Text>
          <Text style={[styles.colPrice, styles.cell, { color: colors.ink }]}>{formatRwf(entry.yourCost)}</Text>
          <Text style={[styles.colPrice, styles.cell, { color: colors.secondary }]}>{formatRwf(entry.peerAvgCost)}</Text>
          <Text style={[styles.colPrice, styles.cell, { color: colors.leaf }]}>{formatRwf(entry.yourCost * markup)}</Text>
        </View>
      ))}
      <Text style={[styles.disclaimer, { color: colors.secondary }]}>{t('ranking_pricingDisclaimer')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md, ...shadow.card },
  title: { ...text.h2, marginBottom: space.sm },
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, paddingBottom: space.xs, marginBottom: space.xs },
  headCell: { ...text.micro },
  row: { flexDirection: 'row', paddingVertical: 4 },
  cell: { ...text.caption, fontVariant: ['tabular-nums'] },
  colIngredient: { flex: 1.4 },
  colPrice: { flex: 1, textAlign: 'right' },
  disclaimer: { ...text.caption, fontStyle: 'italic', marginTop: space.sm },
});

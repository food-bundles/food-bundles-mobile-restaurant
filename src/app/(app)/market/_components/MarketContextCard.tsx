import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

interface CheapProteinRow {
  name: string;
  priceLabel: string;
}

const CHEAP_PROTEINS: CheapProteinRow[] = [
  { name: 'Eggs', priceLabel: '180 RWF each' },
  { name: 'Beans', priceLabel: '1,200 RWF/kg' },
  { name: 'Fish', priceLabel: '2,800 RWF/kg' },
];

/** "Today's cheapest proteins" mini-card shown below the covers picker on the menu-generator form. */
export function MarketContextCard() {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.paper, borderLeftColor: colors.leaf }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('menu_cheapestProteinsTitle')}</Text>
      {CHEAP_PROTEINS.map((row) => (
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

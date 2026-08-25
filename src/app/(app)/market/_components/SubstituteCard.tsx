import { StyleSheet, Text, View } from 'react-native';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { ProductLineImage } from '@/components/product';
import { products } from '@/mocks';
import type { Substitution } from '@/mocks';
import { useT } from '@/i18n';

export interface SubstituteCardProps {
  substitution: Substitution;
}

/** Shows a cheaper substitute product with a one-line note, when the original is running expensive. */
export function SubstituteCard({ substitution }: SubstituteCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const from = products.find((p) => p.id === substitution.fromProductId);
  const to = products.find((p) => p.id === substitution.toProductId);
  if (!from || !to) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('advisor_bestSubstitute')}</Text>
      <View style={styles.row}>
        <ProductLineImage source={from.image} label={from.name} />
        <Text style={[styles.arrow, { color: colors.secondary }]}>→</Text>
        <ProductLineImage source={to.image} label={to.name} />
        <View style={styles.namesCol}>
          <Text style={[styles.fromName, { color: colors.secondary }]}>{from.name}</Text>
          <Text style={[styles.toName, { color: colors.ink }]}>{to.name}</Text>
        </View>
      </View>
      <Text style={[styles.note, { color: colors.secondary }]}>{substitution.note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    borderRadius: radius.lg,
    padding: space.md,
    marginRight: space.sm,
    ...shadow.card,
  },
  title: { ...text.overline, marginBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  arrow: { ...text.body },
  namesCol: { flex: 1 },
  fromName: { ...text.caption, textDecorationLine: 'line-through' },
  toName: { ...text.bodySemi },
  note: { ...text.caption, marginTop: space.sm },
});

import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import type { ConsolidatedIngredient } from '@/lib';

export interface IngredientListRowProps {
  ingredient: ConsolidatedIngredient;
}

/** One row in the "By ingredient" consolidated shopping list, with a market-source badge. */
export function IngredientListRow({ ingredient }: IngredientListRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: colors.ink }]}>{ingredient.productId}</Text>
        <Text style={[styles.qty, { color: colors.secondary }]}>Qty: {ingredient.qty}</Text>
      </View>
      <Badge tone="leaf" label={ingredient.source} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.sm },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  qty: { ...text.caption, marginTop: 2 },
});

import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { ProductLineImage } from '@/components/product';
import { formatRwf } from '@/lib';
import type { ConsolidatedIngredient } from '@/lib';
import { products } from '@/mocks';

export interface IngredientListRowProps {
  ingredient: ConsolidatedIngredient;
}

/** One row in the "By ingredient" consolidated shopping list, with a market-source badge. */
export function IngredientListRow({ ingredient }: IngredientListRowProps) {
  const { colors } = useTheme();
  const product = products.find((p) => p.id === ingredient.productId);
  if (!product) return null;

  return (
    <View style={styles.row}>
      <ProductLineImage source={product.image} label={product.name} />
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: colors.ink }]}>{product.name}</Text>
        <Text style={[styles.qty, { color: colors.secondary }]}>
          {ingredient.qty} × {product.unit} — {formatRwf(product.price)}
        </Text>
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

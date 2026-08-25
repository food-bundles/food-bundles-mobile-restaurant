import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { QuantityStepper } from '@/components/product';
import { formatRwf } from '@/lib';
import { products } from '@/mocks';
import type { MenuDish } from '@/mocks/types';
import { useT } from '@/i18n';

export interface MenuDishCardProps {
  dish: MenuDish;
  onAddIngredients: (dish: MenuDish, quantities: Record<string, number>) => void;
}

/** One generated menu item: estimated cost, ingredient breakdown, and an expandable quantity editor. */
export function MenuDishCard({ dish, onAddIngredients }: MenuDishCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(dish.ingredients.map((ingredient) => [ingredient.productId, ingredient.qty])),
  );

  const lines = dish.ingredients.map((ingredient) => {
    const product = products.find((p) => p.id === ingredient.productId);
    const qty = quantities[ingredient.productId] ?? ingredient.qty;
    return { product, qty };
  });
  const estimatedCost = lines.reduce((sum, line) => sum + (line.product ? line.product.price * line.qty : 0), 0);

  const setQty = (productId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, qty) }));
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: colors.ink }]}>{dish.name}</Text>
        <Badge tone="leaf" label={dish.cuisine} />
      </View>
      <Text style={[styles.cost, { color: colors.leaf }]}>{t('menu_costPerPortion', { amount: formatRwf(estimatedCost) })}</Text>
      <Text style={[styles.source, { color: colors.secondary }]}>{t('menu_bestSourcedFrom', { source: dish.source })}</Text>
      {lines.map(({ product, qty }) =>
        product ? (
          <Text key={product.id} style={[styles.ingredientLine, { color: colors.secondary }]}>
            {`${product.name} — ${qty} ${product.unit} — ${formatRwf(product.price)} — ${dish.source}`}
          </Text>
        ) : null,
      )}
      <Pressable
        onPress={() => onAddIngredients(dish, quantities)}
        accessibilityRole="button"
        accessibilityLabel={t('menu_addAllToCart')}
        style={[styles.addButton, { backgroundColor: colors.marigold }]}
      >
        <Text style={[styles.addLabel, { color: colors.pine }]}>{t('menu_addAllToCart')}</Text>
      </Pressable>
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={t('menu_adjustQuantities')}
        style={styles.expandHit}
      >
        <Text style={[styles.expandLabel, { color: colors.leaf }]}>{t('menu_adjustQuantities')}</Text>
      </Pressable>
      {expanded ? (
        <View style={styles.adjustGroup}>
          {lines.map(({ product, qty }) =>
            product ? (
              <View key={product.id} style={styles.adjustRow}>
                <Text style={[styles.adjustName, { color: colors.ink }]}>{product.name}</Text>
                <QuantityStepper
                  qty={qty}
                  onInc={() => setQty(product.id, qty + 1)}
                  onDec={() => setQty(product.id, qty - 1)}
                />
              </View>
            ) : null,
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.md, marginBottom: space.sm, ...shadow.card },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...text.h2, flexShrink: 1 },
  cost: { ...text.bodySemi, marginTop: space.xs },
  source: { ...text.caption, marginTop: 2, marginBottom: space.sm },
  ingredientLine: { ...text.caption, marginTop: 2 },
  addButton: {
    minHeight: hit.min,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  addLabel: { ...text.bodySemi },
  expandHit: { minHeight: hit.min, justifyContent: 'center', alignItems: 'center', marginTop: space.xs },
  expandLabel: { ...text.label },
  adjustGroup: { marginTop: space.sm, gap: space.sm },
  adjustRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adjustName: { ...text.body, flex: 1 },
});

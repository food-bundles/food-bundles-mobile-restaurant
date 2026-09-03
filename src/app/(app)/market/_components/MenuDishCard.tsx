import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { CheckIcon } from '@/components/icons';
import { QuantityStepper } from '@/components/product';
import { formatRwf } from '@/lib';
import { products } from '@/mocks';
import type { MenuDish } from '@/mocks/types';
import { useT } from '@/i18n';

export interface MenuDishCardProps {
  dish: MenuDish;
  onAddIngredients: (dish: MenuDish, productIds: string[], quantities: Record<string, number>) => void;
}

const PHOTO_HEIGHT = 160;

/** One generated menu item: photo, per-ingredient checkboxes (opt-in), and an expandable quantity editor. */
export function MenuDishCard({ dish, onAddIngredients }: MenuDishCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(dish.ingredients.map((ingredient) => [ingredient.productId, ingredient.qty])),
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const lines = dish.ingredients.map((ingredient) => {
    const product = products.find((p) => p.id === ingredient.productId);
    const qty = quantities[ingredient.productId] ?? ingredient.qty;
    return { product, qty };
  });
  const selectedIds = lines.filter(({ product }) => product && checked[product.id]).map(({ product }) => product!.id);
  const estimatedCost = lines.reduce((sum, line) => sum + (line.product ? line.product.price * line.qty : 0), 0);
  const allSelected = lines.length > 0 && lines.every(({ product }) => !product || checked[product.id]);

  const setQty = (productId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, qty) }));
  };
  const toggleChecked = (productId: string) => {
    setChecked((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };
  const onToggleSelectAll = () => {
    const next: Record<string, boolean> = {};
    if (!allSelected) for (const { product } of lines) if (product) next[product.id] = true;
    setChecked(next);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Image source={dish.image} style={styles.photo} accessibilityLabel={dish.name} resizeMode="cover" />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: colors.ink }]}>{dish.name}</Text>
          <Badge tone="leaf" label={dish.cuisine} />
        </View>
        <Text style={[styles.cost, { color: colors.leaf }]}>{t('menu_costPerPortion', { amount: formatRwf(estimatedCost) })}</Text>
        <Text style={[styles.source, { color: colors.secondary }]}>{t('menu_bestSourcedFrom', { source: dish.source })}</Text>

        <Pressable
          onPress={onToggleSelectAll}
          accessibilityRole="button"
          accessibilityState={{ checked: allSelected }}
          accessibilityLabel={t(allSelected ? 'menu_deselectAllIngredients' : 'menu_selectAllIngredients')}
          style={styles.selectAllHit}
        >
          <Text style={[styles.selectAllLabel, { color: colors.leaf }]}>
            {t(allSelected ? 'menu_deselectAllIngredients' : 'menu_selectAllIngredients')}
          </Text>
        </Pressable>

        {lines.map(({ product, qty }) => {
          if (!product) return null;
          const isChecked = Boolean(checked[product.id]);
          return (
            <Pressable
              key={product.id}
              onPress={() => toggleChecked(product.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              accessibilityLabel={`${product.name}, ${qty} ${product.unit}, ${formatRwf(product.price)}`}
              style={styles.ingredientRow}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: colors.leaf },
                  isChecked && { backgroundColor: colors.leaf },
                ]}
              >
                {isChecked ? <CheckIcon size={14} color={colors.paper} /> : null}
              </View>
              <Text style={[styles.ingredientLine, { color: colors.secondary }]}>
                {`${product.name} — ${qty} ${product.unit} — ${formatRwf(product.price)} — ${dish.source}`}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => onAddIngredients(dish, selectedIds, quantities)}
          disabled={selectedIds.length === 0}
          accessibilityRole="button"
          accessibilityLabel={t('menu_addSelectedToCart')}
          style={[
            styles.addButton,
            { backgroundColor: colors.marigold },
            selectedIds.length === 0 && styles.disabled,
          ]}
        >
          <Text style={[styles.addLabel, { color: colors.pine }]}>{t('menu_addSelectedToCart')}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, marginBottom: space.sm, overflow: 'hidden', ...shadow.card },
  photo: { width: '100%', height: PHOTO_HEIGHT },
  body: { padding: space.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...text.h2, flexShrink: 1 },
  cost: { ...text.bodySemi, marginTop: space.xs },
  source: { ...text.caption, marginTop: 2, marginBottom: space.sm },
  selectAllHit: { minHeight: hit.min, justifyContent: 'center', alignSelf: 'flex-start' },
  selectAllLabel: { ...text.label },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: hit.min },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientLine: { ...text.caption, flex: 1 },
  addButton: {
    minHeight: hit.min,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  disabled: { opacity: 0.5 },
  addLabel: { ...text.bodySemi },
  expandHit: { minHeight: hit.min, justifyContent: 'center', alignItems: 'center', marginTop: space.xs },
  expandLabel: { ...text.label },
  adjustGroup: { marginTop: space.sm, gap: space.sm },
  adjustRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adjustName: { ...text.body, flex: 1 },
});

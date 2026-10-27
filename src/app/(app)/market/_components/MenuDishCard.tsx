import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { Badge } from '@/components/primitives';
import { CheckIcon } from '@/components/icons';
import { QuantityStepper } from '@/components/product';
import type { MenuDish } from '@/lib';
import { useT } from '@/i18n';

export interface MenuDishCardProps {
  dish: MenuDish;
  onAddIngredients: (dish: MenuDish, productIds: string[], quantities: Record<string, number>) => void;
}

const PHOTO_HEIGHT = 160;

export function MenuDishCard({ dish, onAddIngredients }: MenuDishCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(dish.ingredients.map((i) => [i.productId, i.qty])),
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const selectedIds = dish.ingredients.filter((i) => checked[i.productId]).map((i) => i.productId);
  const allSelected = dish.ingredients.length > 0 && dish.ingredients.every((i) => checked[i.productId]);

  const setQty = (productId: string, qty: number) =>
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, qty) }));

  const toggleChecked = (productId: string) =>
    setChecked((prev) => ({ ...prev, [productId]: !prev[productId] }));

  const onToggleSelectAll = () => {
    if (allSelected) { setChecked({}); return; }
    setChecked(Object.fromEntries(dish.ingredients.map((i) => [i.productId, true])));
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Image source={dish.image} style={styles.photo} accessibilityLabel={dish.name} resizeMode="cover" />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: colors.ink }]}>{dish.name}</Text>
          <Badge tone="leaf" label={dish.cuisine} />
        </View>
        <Text style={[styles.source, { color: colors.secondary }]}>{t('menu_bestSourcedFrom', { source: dish.source })}</Text>

        <Pressable onPress={onToggleSelectAll} accessibilityRole="button" style={styles.selectAllHit}>
          <Text style={[styles.selectAllLabel, { color: colors.leaf }]}>
            {t(allSelected ? 'menu_deselectAllIngredients' : 'menu_selectAllIngredients')}
          </Text>
        </Pressable>

        {dish.ingredients.map((ingredient) => {
          const isChecked = Boolean(checked[ingredient.productId]);
          const qty = quantities[ingredient.productId] ?? ingredient.qty;
          return (
            <Pressable
              key={ingredient.productId}
              onPress={() => toggleChecked(ingredient.productId)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              style={styles.ingredientRow}
            >
              <View style={[styles.checkbox, { borderColor: colors.leaf }, isChecked && { backgroundColor: colors.leaf }]}>
                {isChecked ? <CheckIcon size={14} color={colors.paper} /> : null}
              </View>
              <Text style={[styles.ingredientLine, { color: colors.secondary }]}>
                {ingredient.productId} — {qty} units
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => onAddIngredients(dish, selectedIds, quantities)}
          disabled={selectedIds.length === 0}
          accessibilityRole="button"
          style={[styles.addButton, { backgroundColor: colors.marigold }, selectedIds.length === 0 && styles.disabled]}
        >
          <Text style={[styles.addLabel, { color: colors.pine }]}>{t('menu_addSelectedToCart')}</Text>
        </Pressable>

        <Pressable onPress={() => setExpanded((prev) => !prev)} accessibilityRole="button" style={styles.expandHit}>
          <Text style={[styles.expandLabel, { color: colors.leaf }]}>{t('menu_adjustQuantities')}</Text>
        </Pressable>

        {expanded ? (
          <View style={styles.adjustGroup}>
            {dish.ingredients.map((ingredient) => {
              const qty = quantities[ingredient.productId] ?? ingredient.qty;
              return (
                <View key={ingredient.productId} style={styles.adjustRow}>
                  <Text style={[styles.adjustName, { color: colors.ink }]}>{ingredient.productId}</Text>
                  <QuantityStepper qty={qty} onInc={() => setQty(ingredient.productId, qty + 1)} onDec={() => setQty(ingredient.productId, qty - 1)} />
                </View>
              );
            })}
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
  source: { ...text.caption, marginTop: 2, marginBottom: space.sm },
  selectAllHit: { minHeight: hit.min, justifyContent: 'center', alignSelf: 'flex-start' },
  selectAllLabel: { ...text.label },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: hit.min },
  checkbox: { width: 20, height: 20, borderRadius: radius.sm / 2, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  ingredientLine: { ...text.caption, flex: 1 },
  addButton: { minHeight: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', marginTop: space.md },
  disabled: { opacity: 0.5 },
  addLabel: { ...text.bodySemi },
  expandHit: { minHeight: hit.min, justifyContent: 'center', alignItems: 'center', marginTop: space.xs },
  expandLabel: { ...text.label },
  adjustGroup: { marginTop: space.sm, gap: space.sm },
  adjustRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adjustName: { ...text.body, flex: 1 },
});

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenHeader } from '@/components/layout';
import { useMarketStore } from '@/stores/marketStore';
import { formatRwf } from '@/lib';

interface IngredientRow {
  id: string;
  name: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
}

let nextId = 1;
function mkId() { return String(nextId++); }

function makeRow(name = '', pricePerUnit = 0, unit = 'kg'): IngredientRow {
  return { id: mkId(), name, qty: 1, unit, pricePerUnit };
}

export default function RecipeCosting() {
  const { colors } = useTheme();
  const dashboard = useMarketStore((s) => s.dashboard);
  const fetchDashboard = useMarketStore((s) => s.fetchDashboard);
  const status = useMarketStore((s) => s.status);

  const [dishName, setDishName] = useState('');
  const [servings, setServings] = useState(1);
  const [markup, setMarkup] = useState(30);
  const [rows, setRows] = useState<IngredientRow[]>([makeRow()]);

  useEffect(() => {
    if (status === 'idle') fetchDashboard();
  }, [status, fetchDashboard]);

  const suggestions = dashboard?.commodities.map((c) => ({
    name: c.name,
    unit: c.unit,
    price: c.latestPrice,
  })) ?? [];

  function updateRow(id: string, patch: Partial<IngredientRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow()]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const totalCost = rows.reduce((sum, r) => sum + r.qty * r.pricePerUnit, 0);
  const costPerServing = servings > 0 ? totalCost / servings : totalCost;
  const suggestedPrice = costPerServing * (1 + markup / 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Recipe Costing" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Dish info */}
        <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <Text style={[styles.label, { color: colors.secondary }]}>Dish name</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.hairline, color: colors.ink }]}
            value={dishName}
            onChangeText={setDishName}
            placeholder="e.g. Fried Rice"
            placeholderTextColor={colors.muted}
          />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: colors.secondary }]}>Servings</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.hairline, color: colors.ink }]}
                value={String(servings)}
                onChangeText={(v) => setServings(Math.max(1, Number(v) || 1))}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: colors.secondary }]}>Markup %</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.hairline, color: colors.ink }]}
                value={String(markup)}
                onChangeText={(v) => setMarkup(Math.max(0, Number(v) || 0))}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>INGREDIENTS</Text>
        <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          {rows.map((row, idx) => (
            <View key={row.id}>
              {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.hairline }]} />}
              <View style={styles.ingredientRow}>
                <TextInput
                  style={[styles.ingName, { borderColor: colors.hairline, color: colors.ink }]}
                  value={row.name}
                  onChangeText={(v) => updateRow(row.id, { name: v })}
                  placeholder="Ingredient"
                  placeholderTextColor={colors.muted}
                />
                <TextInput
                  style={[styles.ingQty, { borderColor: colors.hairline, color: colors.ink }]}
                  value={String(row.qty)}
                  onChangeText={(v) => updateRow(row.id, { qty: Math.max(0, Number(v) || 0) })}
                  keyboardType="decimal-pad"
                  placeholder="Qty"
                  placeholderTextColor={colors.muted}
                />
                <TextInput
                  style={[styles.ingPrice, { borderColor: colors.hairline, color: colors.ink }]}
                  value={row.pricePerUnit > 0 ? String(row.pricePerUnit) : ''}
                  onChangeText={(v) => updateRow(row.id, { pricePerUnit: Number(v) || 0 })}
                  keyboardType="decimal-pad"
                  placeholder="Price/unit"
                  placeholderTextColor={colors.muted}
                />
                {rows.length > 1 && (
                  <Pressable onPress={() => removeRow(row.id)} style={styles.removeBtn}>
                    <Text style={[styles.removeLabel, { color: colors.chili }]}>✕</Text>
                  </Pressable>
                )}
              </View>
              {/* Market price suggestions */}
              {row.name.length > 0 && suggestions.length > 0 && !row.pricePerUnit ? (
                <View style={styles.suggestRow}>
                  {suggestions
                    .filter((s) => s.name.toLowerCase().includes(row.name.toLowerCase()))
                    .slice(0, 2)
                    .map((s) => (
                      <Pressable
                        key={s.name}
                        onPress={() => updateRow(row.id, { pricePerUnit: s.price, unit: s.unit })}
                        style={[styles.suggestChip, { backgroundColor: colors.tintLeaf }]}
                      >
                        <Text style={[styles.suggestText, { color: colors.pine }]}>
                          {s.name}: {formatRwf(s.price)}/{s.unit}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              ) : null}
            </View>
          ))}
          <Pressable onPress={addRow} style={styles.addBtn}>
            <Text style={[styles.addLabel, { color: colors.leaf }]}>+ Add Ingredient</Text>
          </Pressable>
        </View>

        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.pine }]}>
          <Text style={[styles.summaryTitle, { color: colors.onPine }]}>Cost Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryKey, { color: colors.onPine }]}>Total ingredient cost</Text>
            <Text style={[styles.summaryVal, { color: colors.paper }]}>{formatRwf(totalCost)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryKey, { color: colors.onPine }]}>Cost per serving</Text>
            <Text style={[styles.summaryVal, { color: colors.paper }]}>{formatRwf(costPerServing)}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.paper, opacity: 0.2, marginVertical: space.sm }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryKey, { color: colors.onPine }]}>Suggested menu price ({markup}% markup)</Text>
            <Text style={[styles.summaryBig, { color: colors.marigold }]}>{formatRwf(suggestedPrice)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: space.lg, gap: space.md, paddingBottom: space.xxl },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.md, gap: space.sm },
  label: { ...text.label },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    ...text.body,
    minHeight: hit.min,
  },
  row: { flexDirection: 'row', gap: space.sm },
  halfField: { flex: 1, gap: space.xs },
  sectionLabel: { ...text.overline },
  ingredientRow: { flexDirection: 'row', gap: space.xs, alignItems: 'center' },
  ingName: {
    flex: 3,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    ...text.body,
  },
  ingQty: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    ...text.body,
    textAlign: 'center',
  },
  ingPrice: {
    flex: 2,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    ...text.body,
  },
  removeBtn: { padding: space.xs },
  removeLabel: { ...text.bodySemi },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, marginTop: space.xs },
  suggestChip: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 4 },
  suggestText: { ...text.micro },
  addBtn: { paddingVertical: space.sm, alignItems: 'center' },
  addLabel: { ...text.bodySemi },
  divider: { height: 1 },
  summaryCard: { borderRadius: radius.lg, padding: space.md, gap: space.sm },
  summaryTitle: { ...text.overline, marginBottom: space.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryKey: { ...text.caption, flex: 1 },
  summaryVal: { ...text.bodySemi },
  summaryBig: { ...text.h2 },
});

import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { formatRwf } from '@/lib';
import { request } from '@/api/client';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  available: boolean;
}

let rid = 1;
function tempId() { return `tmp-${rid++}`; }

export default function MenuManagement() {
  const { colors } = useTheme();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await request<{ data: MenuItem[] }>('/menu-items');
      setItems(res.data);
    } catch {
      // stub: no backend yet
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    const name = formName.trim();
    const price = Number(formPrice);
    if (!name || !price) return;
    setSaving(true);
    setError(null);
    try {
      const res = await request<{ data: MenuItem }>('/menu-items', {
        method: 'POST',
        body: {
          name,
          description: formDesc.trim() || undefined,
          price,
          category: formCategory.trim() || undefined,
        },
      });
      setItems((prev) => [...prev, res.data]);
    } catch {
      // local stub
      setItems((prev) => [...prev, {
        id: tempId(),
        name,
        description: formDesc.trim() || undefined,
        price,
        category: formCategory.trim() || undefined,
        available: true,
      }]);
    } finally {
      setSaving(false);
      resetForm();
    }
  }

  async function toggleAvailability(id: string, available: boolean) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, available } : item));
    try {
      await request(`/menu-items/${id}`, { method: 'PATCH', body: { available } });
    } catch {
      // revert on failure
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, available: !available } : item));
    }
  }

  async function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await request(`/menu-items/${id}`, { method: 'DELETE' });
    } catch {
      // already removed locally — ok
    }
  }

  function resetForm() {
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormCategory('');
    setShowForm(false);
  }

  const byCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Menu Management" />
      <ScreenScroll contentInsetBottom={40}>
        {loading ? (
          <ActivityIndicator color={colors.leaf} style={styles.loader} />
        ) : (
          <>
            {Object.entries(byCategory).map(([category, catItems]) => (
              <View key={category} style={styles.section}>
                <Text style={[styles.categoryLabel, { color: colors.secondary }]}>{category.toUpperCase()}</Text>
                <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                  {catItems.map((item, idx) => (
                    <View key={item.id}>
                      {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.hairline }]} />}
                      <View style={styles.itemRow}>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, { color: item.available ? colors.ink : colors.muted }]}>
                            {item.name}
                          </Text>
                          {item.description ? (
                            <Text style={[styles.itemDesc, { color: colors.secondary }]} numberOfLines={1}>
                              {item.description}
                            </Text>
                          ) : null}
                          <Text style={[styles.itemPrice, { color: colors.leaf }]}>{formatRwf(item.price)}</Text>
                        </View>
                        <View style={styles.itemActions}>
                          <Pressable
                            onPress={() => toggleAvailability(item.id, !item.available)}
                            style={[
                              styles.availBtn,
                              { backgroundColor: item.available ? colors.tintLeaf : colors.neutral },
                            ]}
                          >
                            <Text style={[styles.availLabel, { color: item.available ? colors.pine : colors.secondary }]}>
                              {item.available ? 'On' : 'Off'}
                            </Text>
                          </Pressable>
                          <Pressable onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
                            <Text style={[styles.deleteLabel, { color: colors.chili }]}>✕</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {items.length === 0 && !showForm ? (
              <Text style={[styles.empty, { color: colors.secondary }]}>
                No menu items yet. Add your first dish below.
              </Text>
            ) : null}

            {showForm ? (
              <View style={[styles.formCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
                <Text style={[styles.formTitle, { color: colors.ink }]}>Add Menu Item</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.hairline, color: colors.ink }]}
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="Dish name *"
                  placeholderTextColor={colors.muted}
                />
                <TextInput
                  style={[styles.input, { borderColor: colors.hairline, color: colors.ink }]}
                  value={formDesc}
                  onChangeText={setFormDesc}
                  placeholder="Description (optional)"
                  placeholderTextColor={colors.muted}
                />
                <TextInput
                  style={[styles.input, { borderColor: colors.hairline, color: colors.ink }]}
                  value={formPrice}
                  onChangeText={setFormPrice}
                  placeholder="Price (RWF) *"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                />
                <TextInput
                  style={[styles.input, { borderColor: colors.hairline, color: colors.ink }]}
                  value={formCategory}
                  onChangeText={setFormCategory}
                  placeholder="Category (optional, e.g. Starters)"
                  placeholderTextColor={colors.muted}
                />
                {error ? <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text> : null}
                <View style={styles.formButtons}>
                  <Pressable onPress={resetForm} style={[styles.cancelBtn, { borderColor: colors.hairline }]}>
                    <Text style={[styles.cancelLabel, { color: colors.secondary }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={onSave}
                    disabled={!formName.trim() || !formPrice || saving}
                    style={[
                      styles.saveBtn,
                      { backgroundColor: colors.leaf },
                      (!formName.trim() || !formPrice || saving) && styles.btnDisabled,
                    ]}
                  >
                    {saving ? (
                      <ActivityIndicator color={colors.paper} size="small" />
                    ) : (
                      <Text style={[styles.saveLabel, { color: colors.paper }]}>Save</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setShowForm(true)}
                style={[styles.addButton, { borderColor: colors.leaf }]}
              >
                <Text style={[styles.addLabel, { color: colors.leaf }]}>+ Add Menu Item</Text>
              </Pressable>
            )}
          </>
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { marginTop: space.xxl },
  section: { marginTop: space.md },
  categoryLabel: { ...text.overline, marginBottom: space.sm },
  card: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  divider: { height: 1 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: space.md },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { ...text.bodySemi },
  itemDesc: { ...text.caption },
  itemPrice: { ...text.label, marginTop: 2 },
  itemActions: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  availBtn: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 4, minWidth: 36, alignItems: 'center' },
  availLabel: { ...text.micro, fontWeight: '700' },
  deleteBtn: { padding: space.xs },
  deleteLabel: { ...text.bodySemi },
  empty: { ...text.body, textAlign: 'center', marginTop: space.xl },
  formCard: { borderWidth: 1, borderRadius: radius.lg, padding: space.md, gap: space.sm, marginTop: space.md },
  formTitle: { ...text.bodySemi, marginBottom: space.xs },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    minHeight: hit.min,
    ...text.body,
  },
  errorText: { ...text.caption },
  formButtons: { flexDirection: 'row', gap: space.sm, marginTop: space.xs },
  cancelBtn: {
    flex: 1,
    minHeight: hit.min,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: { ...text.bodySemi },
  saveBtn: {
    flex: 2,
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  saveLabel: { ...text.bodySemi },
  addButton: {
    minHeight: hit.min,
    borderWidth: 1.5,
    borderRadius: radius.md,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  addLabel: { ...text.bodySemi },
});

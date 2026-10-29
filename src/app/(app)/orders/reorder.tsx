import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { PriceText } from '@/components/product';
import { useOrdersStore } from '@/stores';
import { useT } from '@/i18n';

export default function Reorder() {
  const t = useT();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orders = useOrdersStore((state) => state.orders);
  const reorder = useOrdersStore((state) => state.reorder);

  const order = useMemo(() => orders.find((o) => o.id === id) ?? null, [orders, id]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const onReorder = async () => {
    if (!order) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await reorder(order.id);
      if ((result as any)?.warnings?.length) {
        setWarnings((result as any).warnings);
      }
      router.replace('/(app)/(tabs)/orders');
    } catch (err: any) {
      setError(err.message ?? t('orders_reorderFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader
        title={t('orders_reorderTitle')}
        subtitle={t('orders_reorderFrom', { orderId: order.id })}
      />
      <ScreenScroll contentInsetBottom={80}>
        {warnings.length > 0 && (
          <View style={[styles.warningCard, { backgroundColor: colors.tintMarigold, borderColor: colors.marigold }]}>
            {warnings.map((w, i) => (
              <Text key={i} style={[styles.warningText, { color: colors.tintedAmberText }]}>{w}</Text>
            ))}
          </View>
        )}
        <View style={[styles.summaryCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <Text style={[styles.summaryLabel, { color: colors.secondary }]}>{t('orders_reorderSummary')}</Text>
          {order.lines.map((line) => (
            <View key={line.productId} style={styles.lineRow}>
              <View style={styles.lineLeft}>
                <Text style={[styles.lineName, { color: colors.ink }]}>{line.name}</Text>
                <Text style={[styles.lineMeta, { color: colors.secondary }]}>
                  {line.qty} × {line.unit}
                </Text>
              </View>
              <PriceText amount={line.each * line.qty} size="md" />
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.hairline }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.secondary }]}>{t('orders_reorderTotal')}</Text>
            <PriceText amount={order.total} size="md" />
          </View>
        </View>
        <View style={[styles.noteCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <Text style={[styles.noteText, { color: colors.secondary }]}>{t('orders_reorderNote')}</Text>
        </View>
        {error ? (
          <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text>
        ) : null}
      </ScreenScroll>
      <Pressable
        onPress={onReorder}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel={submitting ? t('orders_reorderingBtn') : t('orders_reorderBtn')}
        style={[styles.reorderButton, { backgroundColor: colors.leaf }, submitting && styles.reorderDisabled]}
      >
        {submitting ? (
          <ActivityIndicator color={colors.paper} />
        ) : (
          <Text style={[styles.reorderLabel, { color: colors.paper }]}>{t('orders_reorderBtn')}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  warningCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
    gap: space.xs,
  },
  warningText: { ...text.caption },
  summaryCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.md,
  },
  summaryLabel: { ...text.overline, marginBottom: space.sm },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: space.xs,
  },
  lineLeft: { flex: 1, marginRight: space.sm },
  lineName: { ...text.body },
  lineMeta: { ...text.caption, marginTop: 2 },
  divider: { height: 1, marginVertical: space.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...text.bodySemi },
  noteCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.md,
  },
  noteText: { ...text.caption },
  errorText: { ...text.caption, textAlign: 'center', marginTop: space.md },
  reorderButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: space.lg,
    marginBottom: space.lg,
  },
  reorderDisabled: { opacity: 0.6 },
  reorderLabel: { ...text.bodySemi },
});

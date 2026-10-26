import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { PriceText } from '@/components/product';
import { useT } from '@/i18n';
import type { OrderLine } from '@/types';

export interface OrderItemsCardProps {
  lines: OrderLine[];
  title?: string;
  showCount?: boolean;
  bare?: boolean;
}

export function OrderItemsCard({ lines, title, showCount = true, bare = false }: OrderItemsCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const label = title ?? t('checkout_itemsInOrder');

  return (
    <View style={bare ? undefined : [styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
        {showCount ? (
          <Text style={[styles.count, { color: colors.secondary }]}>
            {t('checkout_itemsCount', { count: lines.length })}
          </Text>
        ) : null}
      </View>
      {lines.map((line) => (
        <View key={line.productId} style={styles.row}>
          <View style={styles.nameCol}>
            <Text style={[styles.name, { color: colors.ink }]}>{line.name}</Text>
            <Text style={[styles.qty, { color: colors.secondary }]}>
              {line.unit} × {line.qty}
            </Text>
          </View>
          <PriceText amount={line.each * line.qty} size="md" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.xs },
  label: { ...text.overline },
  count: { ...text.caption },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.xs },
  nameCol: { flex: 1 },
  name: { ...text.bodySemi },
  qty: { ...text.caption, marginTop: 1 },
});

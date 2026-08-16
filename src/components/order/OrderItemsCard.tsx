import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import { PriceText, ProductLineImage } from '@/components/product';
import { useT } from '@/i18n';
import { products } from '@/mocks';
import type { OrderLine } from '@/mocks/types';

export interface OrderItemsCardProps {
  lines: OrderLine[];
  title?: string;
  showCount?: boolean;
}

export function OrderItemsCard({ lines, title, showCount = true }: OrderItemsCardProps) {
  const t = useT();
  const label = title ?? t('checkout_itemsInOrder');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {showCount ? <Text style={styles.count}>{t('checkout_itemsCount', { count: lines.length })}</Text> : null}
      </View>
      {lines.map((line) => {
        const product = products.find((p) => p.id === line.productId);
        return (
          <View key={line.productId} style={styles.row}>
            {product ? <ProductLineImage source={product.image} label={line.name} /> : null}
            <Text style={styles.name}>
              {line.name} × {line.qty}
            </Text>
            <PriceText amount={line.each * line.qty} size="md" />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.xs },
  label: { ...text.overline, color: color.secondary },
  count: { ...text.caption, color: color.secondary },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.xs },
  name: { ...text.body, color: color.body, flex: 1 },
});

import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { formatRwfNumber } from '@/lib';
import { useT } from '@/i18n';
import type { OrderLine } from '@/mocks/types';

export interface EbmLineItemsTableProps {
  lines: OrderLine[];
}

/** Every FoodBundles line item is standard-rated (RRA tax category B, 18%) — there is no exempt or zero-rated produce in this catalog. */
const TAX_CODE = 'B';

export function EbmLineItemsTable({ lines }: EbmLineItemsTableProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { borderColor: colors.hairline }]}>
      <Text style={[styles.heading, { color: colors.secondary }]}>{t('ebm_items')}</Text>
      <View style={[styles.headerRow, { borderBottomColor: colors.hairline }]}>
        <Text style={[styles.colItem, styles.headCell, { color: colors.secondary }]}>{t('ebm_colItem')}</Text>
        <Text style={[styles.colQty, styles.headCell, { color: colors.secondary }]}>{t('ebm_colQty')}</Text>
        <Text style={[styles.colAmount, styles.headCell, { color: colors.secondary }]}>{t('ebm_colAmount')}</Text>
        <Text style={[styles.colTax, styles.headCell, { color: colors.secondary }]}>{t('ebm_colTax')}</Text>
      </View>
      {lines.map((line) => (
        <View key={line.productId} style={styles.row}>
          <Text style={[styles.colItem, styles.cell, { color: colors.ink }]} numberOfLines={1}>
            {line.name}
          </Text>
          <Text style={[styles.colQty, styles.cell, { color: colors.ink }]}>
            {line.qty} {line.unit}
          </Text>
          <Text style={[styles.colAmount, styles.cell, { color: colors.ink }]}>
            {formatRwfNumber(line.each * line.qty)}
          </Text>
          <Text style={[styles.colTax, styles.cell, { color: colors.secondary }]}>{TAX_CODE}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: space.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    paddingVertical: space.sm,
  },
  heading: { ...text.overline, marginBottom: space.xs },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 3,
    marginBottom: 3,
  },
  headCell: { ...text.micro },
  row: { flexDirection: 'row', paddingVertical: 2 },
  cell: { ...text.caption, fontVariant: ['tabular-nums'] },
  colItem: { flex: 1.6 },
  colQty: { flex: 1, textAlign: 'right' },
  colAmount: { flex: 1.1, textAlign: 'right' },
  colTax: { flex: 0.5, textAlign: 'right' },
});

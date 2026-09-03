import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { formatRwf, formatDate } from '@/lib';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

export interface EbmInvoiceRowProps {
  order: Order;
  onDownload: () => void;
}

export function EbmInvoiceRow({ order, onDownload }: EbmInvoiceRowProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]} />
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: colors.ink }]}>EBM · {order.id}</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>{formatDate(order.placedAt)} · {formatRwf(order.total)}</Text>
      </View>
      <Pressable
        onPress={onDownload}
        accessibilityRole="button"
        accessibilityLabel={t('ebm_downloadPdf')}
        style={[styles.downloadButton, { borderColor: colors.hairline }]}
      >
        <Text style={[styles.downloadLabel, { color: colors.leaf }]}>{t('ebm_pdf')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  iconWrap: { width: 38, height: 38, borderRadius: radius.sm + 1 },
  textCol: { flex: 1 },
  title: { ...text.bodySemi },
  subtitle: { ...text.caption, marginTop: 2 },
  downloadButton: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadLabel: { ...text.label },
});

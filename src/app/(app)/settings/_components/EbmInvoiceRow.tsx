import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { formatRwf, formatDate } from '@/lib';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

export interface EbmInvoiceRowProps {
  order: Order;
  onDownload: () => void;
}

export function EbmInvoiceRow({ order, onDownload }: EbmInvoiceRowProps) {
  const t = useT();

  return (
    <View style={styles.row}>
      <View style={styles.iconWrap} />
      <View style={styles.textCol}>
        <Text style={styles.title}>EBM · {order.id}</Text>
        <Text style={styles.subtitle}>{formatDate(order.placedAt)} · {formatRwf(order.total)}</Text>
      </View>
      <Pressable
        onPress={onDownload}
        accessibilityRole="button"
        accessibilityLabel={t('ebm_downloadPdf')}
        style={styles.downloadButton}
      >
        <Text style={styles.downloadLabel}>{t('ebm_pdf')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
  },
  iconWrap: { width: 38, height: 38, borderRadius: radius.sm + 1, backgroundColor: color.tintLeaf },
  textCol: { flex: 1 },
  title: { ...text.bodySemi, color: color.ink },
  subtitle: { ...text.caption, color: color.secondary, marginTop: 2 },
  downloadButton: {
    minHeight: hit.min,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadLabel: { ...text.label, color: color.leaf },
});

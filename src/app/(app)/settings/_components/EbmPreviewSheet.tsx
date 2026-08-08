import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

export interface EbmPreviewSheetProps {
  order: Order | null;
  onClose: () => void;
}

export function EbmPreviewSheet({ order, onClose }: EbmPreviewSheetProps) {
  const t = useT();

  return (
    <Modal visible={order !== null} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('action_close')}
          style={styles.scrimTouchable}
        >
          <View style={styles.scrim} />
        </Pressable>
        {order ? (
          <View style={styles.sheet}>
            <Text style={styles.title}>EBM · {order.id}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('orders_total')}</Text>
              <Text style={styles.detailValue}>{formatRwf(order.total)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('orders_deliverTo')}</Text>
              <Text style={styles.detailValue}>{order.address}</Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('ebm_downloadPdf')}
              style={styles.downloadButton}
            >
              <Text style={styles.downloadLabel}>{t('ebm_pdf')}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  scrimTouchable: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrim: { flex: 1, backgroundColor: color.ink, opacity: 0.4 },
  sheet: { backgroundColor: color.paper, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space.lg },
  title: { ...text.h2, color: color.ink },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.md },
  detailLabel: { ...text.caption, color: color.secondary },
  detailValue: { ...text.bodySemi, color: color.ink },
  downloadButton: {
    minHeight: hit.min,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  downloadLabel: { ...text.bodySemi, color: color.paper },
});

import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { OrderItemsCard } from '@/components/order';
import { Toast } from '@/components/primitives';
import { EbmInvoiceHeader } from './EbmInvoiceHeader';
import { EbmInvoiceMeta } from './EbmInvoiceMeta';
import { EbmInvoiceTotals } from './EbmInvoiceTotals';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

export interface EbmPreviewSheetProps {
  order: Order | null;
  onClose: () => void;
}

export function EbmPreviewSheet({ order, onClose }: EbmPreviewSheetProps) {
  const t = useT();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const onDownload = () => setToastMessage(t('ebm_downloadedToast'));

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
            <View style={styles.grabber} />
            <Text style={styles.title}>{t('ebm_invoicePreview')}</Text>
            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
              <EbmInvoiceHeader />
              <EbmInvoiceMeta order={order} />
              <View style={styles.itemsGap}>
                <OrderItemsCard lines={order.lines} title={t('ebm_items')} showCount={false} bare />
              </View>
              <EbmInvoiceTotals order={order} />
            </ScrollView>
            <View style={styles.footerRow}>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={t('action_close')}
                style={styles.closeButton}
              >
                <Text style={styles.closeLabel}>{t('action_close')}</Text>
              </Pressable>
              <Pressable
                onPress={onDownload}
                accessibilityRole="button"
                accessibilityLabel={t('ebm_downloadPdf')}
                style={styles.downloadButton}
              >
                <Text style={styles.downloadLabel}>{t('ebm_downloadPdfLong')}</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
        <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  scrimTouchable: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scrim: { flex: 1, backgroundColor: color.ink, opacity: 0.4 },
  sheet: {
    maxHeight: '85%',
    backgroundColor: color.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.lg,
  },
  scrollArea: { flexShrink: 1 },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.hairline,
    alignSelf: 'center',
    marginBottom: space.sm,
  },
  title: { ...text.h2, color: color.ink, marginBottom: space.md },
  itemsGap: { marginTop: space.md },
  footerRow: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  closeButton: {
    flex: 1,
    minHeight: hit.min,
    borderWidth: 1.5,
    borderColor: color.hairline,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: { ...text.bodySemi, color: color.ink },
  downloadButton: {
    flex: 1,
    minHeight: hit.min,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadLabel: { ...text.bodySemi, color: color.paper },
});

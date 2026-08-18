import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
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
  const { colors } = useTheme();
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
          <View style={[styles.scrim, { backgroundColor: colors.ink }]} />
        </Pressable>
        {order ? (
          <View style={[styles.sheet, { backgroundColor: colors.paper }]}>
            <View style={[styles.grabber, { backgroundColor: colors.hairline }]} />
            <Text style={[styles.title, { color: colors.ink }]}>{t('ebm_invoicePreview')}</Text>
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
                style={[styles.closeButton, { borderColor: colors.hairline }]}
              >
                <Text style={[styles.closeLabel, { color: colors.ink }]}>{t('action_close')}</Text>
              </Pressable>
              <Pressable
                onPress={onDownload}
                accessibilityRole="button"
                accessibilityLabel={t('ebm_downloadPdf')}
                style={[styles.downloadButton, { backgroundColor: colors.leaf }]}
              >
                <Text style={[styles.downloadLabel, { color: colors.paper }]}>{t('ebm_downloadPdfLong')}</Text>
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
  scrim: { flex: 1, opacity: 0.4 },
  sheet: {
    maxHeight: '85%',
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
    alignSelf: 'center',
    marginBottom: space.sm,
  },
  title: { ...text.h2, marginBottom: space.md },
  itemsGap: { marginTop: space.md },
  footerRow: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  closeButton: {
    flex: 1,
    minHeight: hit.min,
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: { ...text.bodySemi },
  downloadButton: {
    flex: 1,
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadLabel: { ...text.bodySemi },
});

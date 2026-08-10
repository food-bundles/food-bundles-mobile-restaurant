import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, space, text } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { EbmInvoiceRow } from './_components/EbmInvoiceRow';
import { EbmPreviewSheet } from './_components/EbmPreviewSheet';
import { orders } from '@/mocks';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

export default function EbmInvoices() {
  const t = useT();
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);
  const eligibleOrders = orders.filter((order) => order.ebmAvailable);

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('ebm_title')} />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={styles.intro}>{t('ebm_intro')}</Text>
        {eligibleOrders.map((order) => (
          <EbmInvoiceRow key={order.id} order={order} onDownload={() => setPreviewOrder(order)} />
        ))}
      </ScreenScroll>
      <EbmPreviewSheet order={previewOrder} onClose={() => setPreviewOrder(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  intro: { ...text.caption, color: color.secondary, marginTop: space.sm, marginBottom: space.md },
});

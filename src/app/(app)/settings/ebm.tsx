import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { EbmInvoiceRow } from './_components/EbmInvoiceRow';
import { EbmPreviewSheet } from './_components/EbmPreviewSheet';
import { orders } from '@/mocks';
import { useT } from '@/i18n';
import type { Order } from '@/mocks/types';

export default function EbmInvoices() {
  const t = useT();
  const { colors } = useTheme();
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null);
  const eligibleOrders = orders.filter((order) => order.ebmAvailable);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('ebm_title')} />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.intro, { color: colors.secondary }]}>{t('ebm_intro')}</Text>
        {eligibleOrders.map((order) => (
          <EbmInvoiceRow key={order.id} order={order} onDownload={() => setPreviewOrder(order)} />
        ))}
      </ScreenScroll>
      <EbmPreviewSheet order={previewOrder} onClose={() => setPreviewOrder(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.caption, marginTop: space.sm, marginBottom: space.md },
});

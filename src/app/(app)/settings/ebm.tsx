import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { ChevronLeftIcon } from '@/components/icons';
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
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('ebm_title')}</Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink },
  intro: { ...text.caption, color: color.secondary, marginTop: space.sm, marginBottom: space.md },
});

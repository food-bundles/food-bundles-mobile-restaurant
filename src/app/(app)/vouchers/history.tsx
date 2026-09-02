import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { VoucherListItem } from '../(tabs)/_components/VoucherListItem';
import { useVouchersStore } from '@/stores';
import { useT } from '@/i18n';

/** Full voucher history across all statuses; a used voucher links to the order it paid for. */
export default function VoucherHistory() {
  const t = useT();
  const { colors } = useTheme();
  const vouchers = useVouchersStore((state) => state.vouchers);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('vouchers_historyTitle')} />
      <ScreenScroll contentInsetBottom={space.xl}>
        {vouchers.length === 0 ? (
          <Text style={[styles.empty, { color: colors.secondary }]}>{t('vouchers_historyEmpty')}</Text>
        ) : (
          vouchers.map((voucher) =>
            voucher.status === 'USED' && voucher.orderId ? (
              <Pressable
                key={voucher.id}
                onPress={() => router.push({ pathname: '/(app)/orders/[id]', params: { id: voucher.orderId! } })}
                accessibilityRole="button"
                accessibilityLabel={t('vouchers_viewOrder', { orderId: voucher.orderId })}
              >
                <VoucherListItem voucher={voucher} />
              </Pressable>
            ) : (
              <VoucherListItem key={voucher.id} voucher={voucher} />
            ),
          )
        )}
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { ...text.body, textAlign: 'center', marginTop: space.xxl },
});

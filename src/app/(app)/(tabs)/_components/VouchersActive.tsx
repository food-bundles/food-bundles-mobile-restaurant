import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { VoucherSummaryCard } from './VoucherSummaryCard';
import { VoucherListItem } from './VoucherListItem';
import { ConsentExpiryBanner } from './ConsentExpiryBanner';
import { useVouchersStore, useSessionStore } from '@/stores';
import { useT } from '@/i18n';
import type { DataConsentSource } from '@/mocks/types';

const CONSENT_SOURCES: DataConsentSource[] = ['eucl', 'rra', 'vubaVuba', 'kayko', 'creditBureau'];

export function VouchersActive() {
  const t = useT();
  const { colors } = useTheme();
  const vouchers = useVouchersStore((state) => state.vouchers);
  const nextGrantDate = useVouchersStore((state) => state.nextGrantDate);
  const isConsentExpired = useVouchersStore((state) => state.isConsentExpired);
  const tier = useSessionStore((state) => state.tier);

  const available = vouchers.filter((voucher) => voucher.status === 'AVAILABLE');
  const availableValue = available.reduce((sum, voucher) => sum + voucher.amount, 0);
  const expiredSources = CONSENT_SOURCES.filter((source) => isConsentExpired(source));

  return (
    <View>
      <ConsentExpiryBanner expiredSources={expiredSources} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('vouchers_title')}</Text>
        <View style={[styles.planBadge, { backgroundColor: colors.tintLeaf }]}>
          <Text style={[styles.planLabel, { color: colors.pine }]}>{tier}</Text>
        </View>
      </View>
      <View style={styles.cardGap}>
        <VoucherSummaryCard
          availableCount={available.length}
          totalCount={vouchers.length}
          availableValue={availableValue}
          nextGrantDate={nextGrantDate}
        />
      </View>
      <Pressable
        onPress={() => router.push('/(app)/checkout/voucher')}
        accessibilityRole="button"
        accessibilityLabel={t('vouchers_useAtCheckout')}
        style={[styles.useButton, { backgroundColor: colors.leaf }]}
      >
        <Text style={[styles.useLabel, { color: colors.paper }]}>{t('vouchers_useAtCheckout')}</Text>
      </Pressable>
      <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('vouchers_yourVouchers')}</Text>
      {vouchers.map((voucher) => (
        <VoucherListItem key={voucher.id} voucher={voucher} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...text.h2 },
  planBadge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  planLabel: { ...text.micro },
  cardGap: { marginTop: space.md },
  useButton: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  useLabel: { ...text.bodySemi },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
});

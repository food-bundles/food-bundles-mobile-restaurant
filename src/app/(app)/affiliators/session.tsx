import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { SearchField } from '@/app/(app)/shop/_components/SearchField';
import { OrderingAsBanner } from './_components/OrderingAsBanner';
import { CloseIcon } from '@/components/icons';
import { WalletTile, VoucherTile } from '@/components/payment';
import { PriceText } from '@/components/product';
import { account, products } from '@/mocks';
import { useT } from '@/i18n';
import { useSessionStore, canRequestVouchers } from '@/stores';

export default function AffiliatorSession() {
  const t = useT();
  const { colors } = useTheme();
  const featured = products[0];
  const role = useSessionStore((state) => state.role);
  const setRole = useSessionStore((state) => state.setRole);
  const previousRole = useRef(role);
  const vouchersAllowed = canRequestVouchers(role);

  useEffect(() => {
    previousRole.current = role;
    setRole('AFFILIATOR');
    return () => setRole(previousRole.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenScroll contentInsetBottom={0}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.signedInLabel, { color: colors.secondary }]}>{t('aff_signedInAs')}</Text>
            <Text style={[styles.name, { color: colors.ink }]}>Jean-Paul K.</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.affBadge, { backgroundColor: colors.tintMarigold }]}>
              <Text style={[styles.affBadgeLabel, { color: colors.tintedAmberText }]}>
                {t('aff_affiliatorBadge')}
              </Text>
            </View>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t('aff_exitSessionLabel')}
              style={[styles.exitButton, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
            >
              <CloseIcon />
            </Pressable>
          </View>
        </View>
        <View style={styles.searchGap}>
          <SearchField value="" onChangeText={() => undefined} placeholder={t('shop_searchProduce')} />
        </View>
        <View style={[styles.dealCard, { backgroundColor: colors.leaf }]}>
          <Text style={[styles.dealTitle, { color: colors.paper }]}>{t('shop_weeklyDeal')}</Text>
          <Text style={[styles.dealSub, { color: colors.onPine }]}>{t('shop_orderByForNextDay')}</Text>
        </View>
        <Text style={[styles.sectionLabel, { color: colors.ink }]}>{t('shop_popularWeek')}</Text>
        <View style={[styles.productRow, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <View style={[styles.productThumb, { backgroundColor: colors.neutral }]} />
          <View style={styles.productText}>
            <Text style={[styles.productName, { color: colors.ink }]}>{featured.name}</Text>
            <Text style={[styles.productUnit, { color: colors.secondary }]}>{featured.unit}</Text>
          </View>
          <PriceText amount={featured.price} size="md" />
        </View>
        <Text style={[styles.sectionLabel, { color: colors.ink }]}>{t('shop_paymentOptions')}</Text>
        <WalletTile selected={false} onPress={() => undefined} balance={account.walletBalance} />
        <View style={styles.voucherGap}>
          <VoucherTile selected={false} onPress={() => undefined} disabled={!vouchersAllowed} />
        </View>
        <View style={[styles.noticeCard, { backgroundColor: colors.tintMarigold }]}>
          <Text style={[styles.noticeText, { color: colors.tintedAmberText }]}>
            {t('aff_voucherRestrictedNote', { manager: account.managerName })}
          </Text>
        </View>
      </ScreenScroll>
      <OrderingAsBanner onExit={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  signedInLabel: { ...text.caption },
  name: { ...text.h2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  affBadge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  affBadgeLabel: { ...text.micro },
  exitButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchGap: { marginTop: space.md },
  dealCard: { borderRadius: radius.lg, padding: space.md, marginTop: space.md },
  dealTitle: { ...text.bodySemi },
  dealSub: { ...text.caption, marginTop: 2 },
  sectionLabel: { ...text.h2, marginTop: space.lg, marginBottom: space.sm },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.sm,
  },
  productThumb: { width: 48, height: 48, borderRadius: radius.sm },
  productText: { flex: 1 },
  productName: { ...text.bodySemi },
  productUnit: { ...text.caption },
  voucherGap: { marginTop: space.sm },
  noticeCard: { borderRadius: radius.md, padding: space.md, marginTop: space.md },
  noticeText: { ...text.caption },
});

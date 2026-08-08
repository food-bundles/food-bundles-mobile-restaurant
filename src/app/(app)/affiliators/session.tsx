import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { SearchField } from '@/app/(app)/shop/_components/SearchField';
import { OrderingAsBanner } from './_components/OrderingAsBanner';
import { CloseIcon } from '@/components/icons';
import { WalletTile, VoucherTile } from '@/components/payment';
import { PriceText } from '@/components/product';
import { account, products } from '@/mocks';
import { useT } from '@/i18n';

export default function AffiliatorSession() {
  const t = useT();
  const featured = products[0];

  return (
    <View style={styles.container}>
      <ScreenScroll contentInsetBottom={0}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.signedInLabel}>{t('aff_signedInAs')}</Text>
            <Text style={styles.name}>Jean-Paul K.</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.affBadge}>
              <Text style={styles.affBadgeLabel}>{t('aff_affiliatorBadge')}</Text>
            </View>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t('aff_exitSessionLabel')}
              style={styles.exitButton}
            >
              <CloseIcon />
            </Pressable>
          </View>
        </View>
        <View style={styles.searchGap}>
          <SearchField value="" onChangeText={() => undefined} placeholder={t('shop_searchProduce')} />
        </View>
        <View style={styles.dealCard}>
          <Text style={styles.dealTitle}>{t('shop_weeklyDeal')}</Text>
          <Text style={styles.dealSub}>{t('shop_orderByForNextDay')}</Text>
        </View>
        <Text style={styles.sectionLabel}>{t('shop_popularWeek')}</Text>
        <View style={styles.productRow}>
          <View style={styles.productThumb} />
          <View style={styles.productText}>
            <Text style={styles.productName}>{featured.name}</Text>
            <Text style={styles.productUnit}>{featured.unit}</Text>
          </View>
          <PriceText amount={featured.price} size="md" />
        </View>
        <Text style={styles.sectionLabel}>{t('shop_paymentOptions')}</Text>
        <WalletTile selected={false} onPress={() => undefined} balance={account.walletBalance} />
        <View style={styles.voucherGap}>
          <VoucherTile selected={false} onPress={() => undefined} disabled />
        </View>
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            {t('aff_voucherRestrictedNote', { manager: account.managerName })}
          </Text>
        </View>
      </ScreenScroll>
      <OrderingAsBanner onExit={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  signedInLabel: { ...text.caption, color: color.secondary },
  name: { ...text.h2, color: color.ink },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  affBadge: { backgroundColor: color.tintMarigold, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  affBadgeLabel: { ...text.micro, color: color.tintedAmberText },
  exitButton: {
    width: hit.min,
    height: hit.min,
    borderRadius: radius.md,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchGap: { marginTop: space.md },
  dealCard: { backgroundColor: color.leaf, borderRadius: radius.lg, padding: space.md, marginTop: space.md },
  dealTitle: { ...text.bodySemi, color: color.paper },
  dealSub: { ...text.caption, color: color.onPine, marginTop: 2 },
  sectionLabel: { ...text.h2, color: color.ink, marginTop: space.lg, marginBottom: space.sm },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.sm,
  },
  productThumb: { width: 48, height: 48, borderRadius: radius.sm, backgroundColor: color.neutral },
  productText: { flex: 1 },
  productName: { ...text.bodySemi, color: color.ink },
  productUnit: { ...text.caption, color: color.secondary },
  voucherGap: { marginTop: space.sm },
  noticeCard: { backgroundColor: color.tintMarigold, borderRadius: radius.md, padding: space.md, marginTop: space.md },
  noticeText: { ...text.caption, color: color.tintedAmberText },
});

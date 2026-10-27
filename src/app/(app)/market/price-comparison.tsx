import { useEffect, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { DateRangeSegmented } from './_components/DateRangeSegmented';
import { ComparisonSummaryCallout } from './_components/ComparisonSummaryCallout';
import { ItemComparisonRow } from './_components/ItemComparisonRow';
import {
  computeItemComparisons,
  computeComparisonSummary,
  buildComparisonCsv,
  filterOrdersByRange,
  type PriceHistoryRange,
} from '@/lib';
import { useOrdersStore, useMarketStore } from '@/stores';
import { useT } from '@/i18n';

/** "Did I pay a good price?" screen: order prices vs. FoodBundles/Kimironko/Nyabugogo, per item. */
export default function PriceComparison() {
  const t = useT();
  const { colors } = useTheme();
  const [range, setRange] = useState<PriceHistoryRange>('MONTH');
  const orders = useOrdersStore((s) => s.orders);
  const fetch = useOrdersStore((s) => s.fetch);
  const status = useOrdersStore((s) => s.status);
  const seriesCache = useMarketStore((s) => s.seriesCache);
  const fetchSeries = useMarketStore((s) => s.fetchSeries);

  useEffect(() => {
    if (status === 'idle') fetch();
    // Fetch comparison for the most common commodity (irishPotatoes as proxy)
    void fetchSeries('irishPotatoes', '7D');
  }, [status, fetch, fetchSeries]);

  const comparison = seriesCache['irishPotatoes-7D']?.comparison ?? [];
  const items = computeItemComparisons(filterOrdersByRange(orders, range), comparison);
  const summary = computeComparisonSummary(items);

  const onDownloadCsv = () => {
    Share.share({ message: buildComparisonCsv(items) });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('priceHistory_title')} />
      <ScreenScroll contentInsetBottom={space.xl}>
        <View style={styles.rangeGap}>
          <DateRangeSegmented active={range} onSelect={setRange} />
        </View>
        <ComparisonSummaryCallout summary={summary} />
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('priceHistory_perItem')}</Text>
        {items.length === 0 ? (
          <Text style={[styles.empty, { color: colors.secondary }]}>{t('priceHistory_empty')}</Text>
        ) : (
          items.map((item) => <ItemComparisonRow key={item.productId} item={item} />)
        )}
        <Pressable
          onPress={onDownloadCsv}
          accessibilityRole="button"
          accessibilityLabel={t('priceHistory_downloadCsv')}
          style={[styles.exportButton, { borderColor: colors.leaf }]}
        >
          <Text style={[styles.exportLabel, { color: colors.leaf }]}>{t('priceHistory_downloadCsv')}</Text>
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  rangeGap: { marginTop: space.md },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  empty: { ...text.body, textAlign: 'center', marginTop: space.lg },
  exportButton: {
    minHeight: hit.min,
    borderWidth: 1.5,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  exportLabel: { ...text.bodySemi },
});

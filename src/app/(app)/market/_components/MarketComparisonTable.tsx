import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import { MarketComparisonRow } from './MarketComparisonRow';
import { useT } from '@/i18n';
import type { CommodityId, MarketComparisonRow as MarketComparisonRowData } from '@/mocks';

export interface MarketComparisonTableProps {
  rows: MarketComparisonRowData[];
  latestPrice: number;
  commodity: CommodityId;
}

/** Market-by-market price comparison; one row can be expanded at a time. */
export function MarketComparisonTable({ rows, latestPrice, commodity }: MarketComparisonTableProps) {
  const t = useT();
  const { colors } = useTheme();
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);

  return (
    <View>
      <Text style={[styles.title, { color: colors.secondary }]}>{t('market_comparisonTitle')}</Text>
      <View style={styles.list}>
        {rows.map((row) => (
          <MarketComparisonRow
            key={row.market}
            row={row}
            latestPrice={latestPrice}
            commodity={commodity}
            expanded={expandedMarket === row.market}
            onToggle={() => setExpandedMarket((current) => (current === row.market ? null : row.market))}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...text.overline, marginBottom: space.sm },
  list: { gap: space.sm },
});

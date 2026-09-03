import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, space, text, useTheme } from '@/theme';
import { ScreenHeader } from '@/components/layout';
import { RefreshIcon } from '@/components/icons';
import { Badge } from '@/components/primitives';
import { useT } from '@/i18n';

export interface MarketScreenHeaderProps {
  minutesAgo: number;
  onRefresh: () => void;
  changePct: number;
}

/** Screen title/back row plus a freshness indicator, refresh action, and price-change badge. */
export function MarketScreenHeader({ minutesAgo, onRefresh, changePct }: MarketScreenHeaderProps) {
  const t = useT();
  const { colors } = useTheme();
  const isUp = changePct >= 0;

  return (
    <View>
      <ScreenHeader
        title={t('market_title')}
        subtitle={t('market_subtitle')}
        trailing={
          <Badge
            tone={isUp ? 'ripe' : 'chili'}
            label={`${isUp ? '+' : ''}${changePct.toFixed(1)}% ${isUp ? '↑' : '↓'}`}
          />
        }
      />
      <Pressable
        onPress={onRefresh}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_refreshPrices')}
        style={styles.updatedRow}
      >
        <RefreshIcon size={14} />
        <Text style={[styles.updatedText, { color: colors.leaf }]}>{t('market_updatedAgo', { minutes: minutesAgo })}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  updatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: hit.min,
    marginTop: space.xs,
    paddingHorizontal: space.md,
  },
  updatedText: { ...text.caption },
});

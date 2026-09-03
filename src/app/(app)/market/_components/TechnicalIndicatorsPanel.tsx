import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { RsiGauge } from './RsiGauge';
import { MomentumIndicator } from './MomentumIndicator';
import { ChevronRightIcon } from '@/components/icons';
import type { MomentumReading } from '@/mocks';
import { useT } from '@/i18n';

export interface TechnicalIndicatorsPanelProps {
  commodityName: string;
  rsi: number;
  momentum: MomentumReading;
}

/** Collapsible panel holding the RSI gauge and momentum indicator for the selected commodity. */
export function TechnicalIndicatorsPanel({ commodityName, rsi, momentum }: TechnicalIndicatorsPanelProps) {
  const t = useT();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <Pressable
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={t('indicators_panelTitle')}
        style={styles.headerRow}
      >
        <Text style={[styles.title, { color: colors.ink }]}>{t('indicators_panelTitle')}</Text>
        <View style={expanded ? styles.chevronOpen : undefined}>
          <ChevronRightIcon color={colors.secondary} />
        </View>
      </Pressable>
      {expanded ? (
        <View style={styles.body}>
          <RsiGauge rsi={rsi} commodityName={commodityName} />
          <MomentumIndicator momentum={momentum} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md, ...shadow.card },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: hit.min,
  },
  title: { ...text.h2 },
  chevronOpen: { transform: [{ rotate: '90deg' }] },
  body: { marginTop: space.sm },
});

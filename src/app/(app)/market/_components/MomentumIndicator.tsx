import { StyleSheet, Text, View } from 'react-native';
import { space, text, useTheme } from '@/theme';
import type { MomentumReading } from '@/mocks';
import { useT } from '@/i18n';

export interface MomentumIndicatorProps {
  momentum: MomentumReading;
}

const ARROW: Record<MomentumReading['direction'], string> = { UP: '↑', FLAT: '→', DOWN: '↓' };

/** Simple up/flat/down momentum arrow with a magnitude label and a plain-language interpretation. */
export function MomentumIndicator({ momentum }: MomentumIndicatorProps) {
  const t = useT();
  const { colors } = useTheme();
  const color =
    momentum.direction === 'UP' ? colors.tintedGreenText : momentum.direction === 'DOWN' ? colors.tintedRedText : colors.secondary;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.ink }]}>{t('indicators_momentumTitle')}</Text>
      <View style={styles.row}>
        <Text style={[styles.arrow, { color }]}>{ARROW[momentum.direction]}</Text>
        <Text style={[styles.magnitude, { color }]}>{momentum.magnitudePct.toFixed(1)}%</Text>
      </View>
      <Text style={[styles.meaning, { color: colors.secondary }]}>{t('indicators_momentumMeaning')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: space.md },
  title: { ...text.overline },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.xs },
  arrow: { ...text.h1 },
  magnitude: { ...text.h2, fontVariant: ['tabular-nums'] },
  meaning: { ...text.caption, marginTop: space.xs },
});

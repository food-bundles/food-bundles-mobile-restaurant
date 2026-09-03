import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

export interface RsiGaugeProps {
  rsi: number;
  commodityName: string;
}

const SIZE = 120;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;

function polarToCartesian(angleDeg: number): { x: number; y: number } {
  const angleRad = ((angleDeg - 180) * Math.PI) / 180;
  return {
    x: SIZE / 2 + RADIUS * Math.cos(angleRad),
    y: SIZE / 2 + RADIUS * Math.sin(angleRad),
  };
}

function arcPath(startDeg: number, endDeg: number): string {
  const start = polarToCartesian(startDeg);
  const end = polarToCartesian(endDeg);
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`;
}

/** 0-100 RSI half-gauge with oversold/neutral/overbought colour zones and a plain-language reading. */
export function RsiGauge({ rsi, commodityName }: RsiGaugeProps) {
  const t = useT();
  const { colors } = useTheme();
  const needleAngle = (rsi / 100) * 180;
  const needleEnd = polarToCartesian(needleAngle);
  const zone = rsi < 30 ? 'oversold' : rsi > 70 ? 'overbought' : 'neutral';
  const zoneColor = zone === 'oversold' ? colors.chili : zone === 'overbought' ? colors.marigold : colors.secondary;
  const meaningKey: TranslationKey =
    zone === 'oversold' ? 'indicators_rsiOversold' : zone === 'overbought' ? 'indicators_rsiOverbought' : 'indicators_rsiNeutral';

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE / 2 + 10} viewBox={`0 0 ${SIZE} ${SIZE / 2 + 10}`}>
        <Path d={arcPath(0, 54)} stroke={colors.chili} strokeWidth={STROKE_WIDTH} fill="none" />
        <Path d={arcPath(54, 126)} stroke={colors.disabledLine} strokeWidth={STROKE_WIDTH} fill="none" />
        <Path d={arcPath(126, 180)} stroke={colors.marigold} strokeWidth={STROKE_WIDTH} fill="none" />
        <Path
          d={`M ${SIZE / 2} ${SIZE / 2} L ${needleEnd.x} ${needleEnd.y}`}
          stroke={colors.ink}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[styles.value, { color: colors.ink }]}>{t('indicators_rsiValue', { value: rsi })}</Text>
      <Text style={[styles.meaning, { color: zoneColor }]}>
        {t(meaningKey, { commodity: commodityName, value: rsi })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  value: { ...text.h2, marginTop: space.xs },
  meaning: { ...text.caption, textAlign: 'center', marginTop: space.xs },
});

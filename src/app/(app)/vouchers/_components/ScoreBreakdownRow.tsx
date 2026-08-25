import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { hit, radius, signatureDuration, space, text, useTheme } from '@/theme';
import { formatRwf } from '@/lib';
import { PlusIcon } from '@/components/icons';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import type { DataConsentSource } from '@/mocks/types';

const NAME_KEY: Record<DataConsentSource, TranslationKey> = {
  eucl: 'consent_euclName',
  rra: 'consent_rraName',
  vubaVuba: 'consent_vubaName',
  kayko: 'consent_kaykoName',
  foodbundles: 'consent_foodbundlesName',
  creditBureau: 'consent_bureauName',
};

export interface ScoreBreakdownRowProps {
  source: DataConsentSource;
  granted: boolean;
  contribution: number;
  maxContribution: number;
  index: number;
  onAuthorize: () => void;
}

/** One source's contribution bar in the score breakdown accordion, staggered in on mount. */
export function ScoreBreakdownRow({
  source,
  granted,
  contribution,
  maxContribution,
  index,
  onAuthorize,
}: ScoreBreakdownRowProps) {
  const t = useT();
  const { colors } = useTheme();
  const fillWidth = useSharedValue(0);
  const targetFraction = granted ? contribution / maxContribution : 1;

  useEffect(() => {
    fillWidth.value = 0;
    fillWidth.value = withDelay(
      index * signatureDuration.scoreBarStagger,
      withTiming(targetFraction, { duration: signatureDuration.scoreBarStagger }),
    );
  }, [targetFraction, index, fillWidth]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fillWidth.value * 100}%` }));

  return (
    <View style={styles.row}>
      <View style={styles.headerLine}>
        <Text style={[styles.name, { color: granted ? colors.ink : colors.secondary }]}>{t(NAME_KEY[source])}</Text>
        {granted ? (
          <Text style={[styles.amount, { color: colors.leaf }]}>+{formatRwf(contribution)}</Text>
        ) : (
          <Pressable
            onPress={onAuthorize}
            accessibilityRole="button"
            accessibilityLabel={t('score_authorizeSource', { source: t(NAME_KEY[source]) })}
            style={styles.authorizeButton}
          >
            <PlusIcon size={14} color={colors.leaf} />
          </Pressable>
        )}
      </View>
      <View style={[styles.track, { backgroundColor: colors.neutral }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: granted ? colors.leaf : colors.disabledLine }, fillStyle]}
        />
      </View>
      {!granted ? <Text style={[styles.hint, { color: colors.secondary }]}>{t('score_notAuthorized')}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: space.md },
  headerLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.xs },
  name: { ...text.label },
  amount: { ...text.label, fontVariant: ['tabular-nums'] },
  authorizeButton: {
    width: hit.min,
    height: hit.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { height: 8, borderRadius: radius.sm, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.sm },
  hint: { ...text.caption, marginTop: 2 },
});

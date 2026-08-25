import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ScoreCircle } from './_components/ScoreCircle';
import { ScoreBreakdownRow } from './_components/ScoreBreakdownRow';
import { useVouchersStore } from '@/stores';
import { computeScore, formatRwf } from '@/lib';
import { useT } from '@/i18n';
import type { DataConsentSource } from '@/mocks/types';

const SOURCE_ORDER: DataConsentSource[] = ['eucl', 'rra', 'vubaVuba', 'kayko', 'foodbundles', 'creditBureau'];

/** Shown after OTP verification: the mock qualification tier, approved limit and per-source contribution breakdown. */
export default function ScoreResult() {
  const t = useT();
  const { colors } = useTheme();
  const consentList = useVouchersStore((state) => state.consentList);
  const setCreditScore = useVouchersStore((state) => state.setCreditScore);

  const score = useMemo(() => {
    const result = computeScore(consentList);
    setCreditScore(result);
    return result;
  }, [consentList, setCreditScore]);

  const maxContribution = Math.max(...score.scoreBreakdown.map((entry) => entry.contribution), 1);
  const grantedSources = new Set(score.scoreBreakdown.map((entry) => entry.source));

  const onAuthorize = (source: DataConsentSource) => {
    router.push({ pathname: '/(app)/vouchers/consent', params: { sources: source } });
  };

  const onClaim = () => {
    router.replace({ pathname: '/(app)/subscription/underwriting', params: { completed: '1' } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenScroll contentInsetBottom={100}>
        <Text style={[styles.title, { color: colors.ink }]}>{t('score_title')}</Text>
        <View style={styles.circleGap}>
          <ScoreCircle tier={score.tier} score={score.limitRwf / 1000} />
        </View>
        <Text style={[styles.limit, { color: colors.leaf }]}>
          {t('score_approvedLimit', { amount: formatRwf(score.limitRwf) })}
        </Text>
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('score_breakdown')}</Text>
        <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          {SOURCE_ORDER.map((source, index) => {
            const entry = score.scoreBreakdown.find((e) => e.source === source);
            return (
              <ScoreBreakdownRow
                key={source}
                source={source}
                granted={grantedSources.has(source)}
                contribution={entry?.contribution ?? 0}
                maxContribution={maxContribution}
                index={index}
                onAuthorize={() => onAuthorize(source)}
              />
            );
          })}
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onClaim}
          accessibilityRole="button"
          accessibilityLabel={t('score_claimCta')}
          style={[styles.claimButton, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.claimLabel, { color: colors.paper }]}>{t('score_claimCta')} →</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { ...text.h1, textAlign: 'center', marginTop: space.lg },
  circleGap: { marginTop: space.lg },
  limit: { ...text.display, textAlign: 'center', marginTop: space.md },
  sectionLabel: { ...text.overline, marginTop: space.xl, marginBottom: space.sm },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.md },
  claimButton: { minHeight: 48, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  claimLabel: { ...text.bodySemi },
});

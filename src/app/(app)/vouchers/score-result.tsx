import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ScoreCircle } from './_components/ScoreCircle';
import { CreditLineCard } from './_components/CreditLineCard';
import { useVouchersStore } from '@/stores';
import { computeScore, formatRwf, TOGGLEABLE_SOURCES } from '@/lib';
import { useT } from '@/i18n';

const RENEWS_AT_ISO = '2026-09-24';
const SUPPLIER_NAME = 'FoodBundles';

/** Shown after OTP verification: an approved-checkmark circle, the credit line, and a link to authorize more. */
export default function ScoreResult() {
  const t = useT();
  const { colors } = useTheme();
  const consentList = useVouchersStore((state) => state.consentList);
  const setCreditScore = useVouchersStore((state) => state.setCreditScore);
  const requestVoucher = useVouchersStore((state) => state.requestVoucher);

  const score = useMemo(() => {
    const result = computeScore(consentList);
    setCreditScore(result);
    return result;
  }, [consentList, setCreditScore]);

  const grantedSources = new Set(score.scoreBreakdown.map((entry) => entry.source));
  const hasUnauthorizedSources = TOGGLEABLE_SOURCES.some((source) => !grantedSources.has(source));

  const onAuthorizeMore = () => router.push('/(app)/vouchers/consent');
  const onClaim = () => {
    requestVoucher(score.limitRwf);
    router.replace({ pathname: '/(app)/subscription/underwriting', params: { completed: '1' } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenScroll contentInsetBottom={100}>
        <View style={styles.circleGap}>
          <ScoreCircle />
        </View>
        <Text style={[styles.caption, { color: colors.secondary }]}>{t('score_title')}</Text>
        <Text style={[styles.limit, { color: colors.leaf }]}>
          {t('score_approvedLimit', { amount: formatRwf(score.limitRwf) })}
        </Text>
        <View style={styles.cardGap}>
          <CreditLineCard limitRwf={score.limitRwf} renewsAtIso={RENEWS_AT_ISO} supplierName={SUPPLIER_NAME} />
        </View>
        {hasUnauthorizedSources ? (
          <Pressable
            onPress={onAuthorizeMore}
            accessibilityRole="button"
            accessibilityLabel={t('score_authorizeMoreSources')}
            style={styles.authorizeMoreHit}
          >
            <Text style={[styles.authorizeMoreLabel, { color: colors.leaf }]}>{t('score_authorizeMoreSources')}</Text>
          </Pressable>
        ) : null}
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
  circleGap: { marginTop: space.xl },
  caption: { ...text.body, textAlign: 'center', marginTop: space.lg },
  limit: { ...text.display, textAlign: 'center', marginTop: space.xs },
  cardGap: { marginTop: space.xl },
  authorizeMoreHit: { minHeight: hit.min, justifyContent: 'center', alignItems: 'center', marginTop: space.lg },
  authorizeMoreLabel: { ...text.label },
  claimButton: { minHeight: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  claimLabel: { ...text.bodySemi },
});

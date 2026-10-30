import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { CurrentPlanCard } from './_components/CurrentPlanCard';
import { useSessionStore, useSubscriptionsStore } from '@/stores';
import { useT } from '@/i18n';

export default function CurrentPlan() {
  const t = useT();
  const { colors } = useTheme();
  const tier = useSessionStore((state) => state.tier);
  const current = useSubscriptionsStore((s) => s.current);
  const cancel = useSubscriptionsStore((s) => s.cancel);
  const [cancelling, setCancelling] = useState(false);

  const isActive = current?.status === 'ACTIVE';
  const isExpiredOrCancelled = current?.status === 'EXPIRED' || current?.status === 'CANCELLED';

  const onCancel = () => {
    Alert.alert(
      t('sub_cancelTitle'),
      t('sub_cancelConfirm'),
      [
        { text: t('sub_cancelNo'), style: 'cancel' },
        {
          text: t('sub_cancelYes'),
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await cancel();
              Alert.alert(t('sub_cancelledTitle'), t('sub_cancelledBody'));
            } catch (err: any) {
              Alert.alert(t('sub_cancelFailed'), err?.message ?? '');
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('sub_yourPlan')} />
      <ScreenScroll contentInsetBottom={40}>
        <View style={styles.cardGap}>
          <CurrentPlanCard tier={tier} />
        </View>

        {current && (
          <View style={styles.meta}>
            {current.endDate ? (
              <Text style={[styles.metaText, { color: colors.secondary }]}>
                {isActive
                  ? t('sub_expiresOn', { date: new Date(current.endDate).toLocaleDateString() })
                  : t('sub_expiredOn', { date: new Date(current.endDate).toLocaleDateString() })}
              </Text>
            ) : null}
            {current.daysRemaining > 0 && isActive ? (
              <Text style={[styles.metaText, { color: colors.leaf }]}>
                {t('sub_daysRemaining', { count: String(current.daysRemaining) })}
              </Text>
            ) : null}
          </View>
        )}

        {isExpiredOrCancelled && (
          <Pressable
            onPress={() => router.push('/(app)/subscription/plans')}
            accessibilityRole="button"
            style={[styles.renewBtn, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.renewLabel, { color: colors.paper }]}>{t('sub_renewPlan')}</Text>
          </Pressable>
        )}

        {!isExpiredOrCancelled && (
          <View style={[styles.unlockCard, { backgroundColor: colors.pine }]}>
            <Text style={[styles.unlockTitle, { color: colors.paper }]}>{t('sub_unlockTitle')}</Text>
            <Text style={[styles.unlockSub, { color: colors.onPine }]}>{t('sub_unlockSub')}</Text>
            <Pressable
              onPress={() => router.push('/(app)/subscription/plans')}
              accessibilityRole="button"
              accessibilityLabel={t('sub_seePlans')}
              style={[styles.seePlansButton, { backgroundColor: colors.marigold }]}
            >
              <Text style={[styles.seePlansLabel, { color: colors.pine }]}>{t('sub_seePlans')}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            onPress={() => router.push('/(app)/subscription/history')}
            accessibilityRole="button"
            style={[styles.actionLink, { borderColor: colors.hairline }]}
          >
            <Text style={[styles.actionLinkLabel, { color: colors.ink }]}>{t('sub_viewHistory')}</Text>
          </Pressable>
          {isActive && (
            <Pressable
              onPress={onCancel}
              disabled={cancelling}
              accessibilityRole="button"
              style={[styles.cancelBtn, { borderColor: colors.chili }, cancelling && styles.btnDisabled]}
            >
              {cancelling
                ? <ActivityIndicator color={colors.chili} />
                : <Text style={[styles.cancelBtnLabel, { color: colors.chili }]}>{t('sub_cancelPlan')}</Text>}
            </Pressable>
          )}
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardGap: { marginTop: space.md },
  meta: { marginTop: space.sm, gap: 4, paddingHorizontal: space.xs },
  metaText: { ...text.caption },
  renewBtn: { minHeight: hit.min, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: space.md },
  renewLabel: { ...text.bodySemi },
  unlockCard: { borderRadius: radius.lg, padding: space.lg, marginTop: space.md },
  unlockTitle: { ...text.bodySemi },
  unlockSub: { ...text.caption, marginTop: space.xs, marginBottom: space.md },
  seePlansButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seePlansLabel: { ...text.bodySemi },
  actions: { marginTop: space.lg, gap: space.sm },
  actionLink: { minHeight: hit.min, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actionLinkLabel: { ...text.bodySemi },
  cancelBtn: { minHeight: hit.min, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  cancelBtnLabel: { ...text.bodySemi },
  btnDisabled: { opacity: 0.5 },
});

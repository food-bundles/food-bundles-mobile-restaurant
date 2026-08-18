import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { CheckIcon } from '@/components/icons';
import { CreditAmountPicker } from './_components/CreditAmountPicker';
import { PriceText } from '@/components/product';
import { useVouchersStore } from '@/stores';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib';

export default function CreditLine() {
  const t = useT();
  const { colors } = useTheme();
  const { completed } = useLocalSearchParams<{ completed?: string }>();
  const requestedAmount = useVouchersStore((state) => state.requestedAmount);
  const adjustRequested = useVouchersStore((state) => state.adjustRequested);
  const creditLimit = useVouchersStore((state) => state.creditLimit);

  if (completed === '1') {
    return (
      <ScreenScroll>
        <View style={styles.completedWrap}>
          <View style={[styles.completedIcon, { backgroundColor: colors.ripe }]}>
            <CheckIcon size={24} color={colors.paper} />
          </View>
          <Text style={[styles.completedTitle, { color: colors.ink }]}>{t('creditLine_approvedTitle')}</Text>
          <Text style={[styles.completedSub, { color: colors.secondary }]}>
            {t('creditLine_approvedSub', { amount: formatRwf(creditLimit) })}
          </Text>
          <Pressable
            onPress={() => router.replace({ pathname: '/(app)/(tabs)/wallet', params: { tab: 'vouchers' } })}
            accessibilityRole="button"
            accessibilityLabel={t('vouchers_startUsing')}
            style={[styles.completedButton, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.completedButtonLabel, { color: colors.paper }]}>
              {t('vouchers_startUsing')} →
            </Text>
          </Pressable>
        </View>
      </ScreenScroll>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('creditLine_title')} />
      <ScreenScroll contentInsetBottom={80}>
        <Text style={[styles.intro, { color: colors.secondary }]}>{t('creditLine_intro')}</Text>
        <View style={styles.pickerGap}>
          <CreditAmountPicker amount={requestedAmount} onAdjust={adjustRequested} />
        </View>
        <View style={[styles.limitRow, { borderTopColor: colors.hairline }]}>
          <Text style={[styles.limitLabel, { color: colors.secondary }]}>{t('checkout_creditAvailable')}</Text>
          <PriceText amount={creditLimit} size="md" />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/checkout/otp', params: { purpose: 'creditLine' } })}
          accessibilityRole="button"
          accessibilityLabel={t('creditLine_submitApplication')}
          style={[styles.submitButton, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.submitLabel, { color: colors.paper }]}>{t('creditLine_submitApplication')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.body, marginTop: space.md },
  pickerGap: { marginTop: space.lg },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
  },
  limitLabel: { ...text.caption },
  submitButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: { ...text.bodySemi },
  completedWrap: { alignItems: 'center', marginTop: space.xxl, gap: space.sm },
  completedIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTitle: { ...text.h1 },
  completedSub: { ...text.body, textAlign: 'center' },
  completedButton: {
    minHeight: 48,
    borderRadius: radius.md,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  completedButtonLabel: { ...text.bodySemi },
});

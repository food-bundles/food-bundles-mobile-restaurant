import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { CheckIcon } from '@/components/icons';
import { CreditAmountPicker } from './_components/CreditAmountPicker';
import { PriceText } from '@/components/product';
import { useVouchersStore } from '@/stores';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib';

export default function CreditLine() {
  const t = useT();
  const { completed } = useLocalSearchParams<{ completed?: string }>();
  const requestedAmount = useVouchersStore((state) => state.requestedAmount);
  const adjustRequested = useVouchersStore((state) => state.adjustRequested);
  const creditLimit = useVouchersStore((state) => state.creditLimit);

  if (completed === '1') {
    return (
      <ScreenScroll>
        <View style={styles.completedWrap}>
          <View style={styles.completedIcon}>
            <CheckIcon size={24} color={color.paper} />
          </View>
          <Text style={styles.completedTitle}>{t('creditLine_approvedTitle')}</Text>
          <Text style={styles.completedSub}>
            {t('creditLine_approvedSub', { amount: formatRwf(creditLimit) })}
          </Text>
          <Pressable
            onPress={() => router.replace({ pathname: '/(app)/(tabs)/wallet', params: { tab: 'vouchers' } })}
            accessibilityRole="button"
            accessibilityLabel={t('vouchers_startUsing')}
            style={styles.completedButton}
          >
            <Text style={styles.completedButtonLabel}>{t('vouchers_startUsing')} →</Text>
          </Pressable>
        </View>
      </ScreenScroll>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('creditLine_title')} />
      <ScreenScroll contentInsetBottom={80}>
        <Text style={styles.intro}>{t('creditLine_intro')}</Text>
        <View style={styles.pickerGap}>
          <CreditAmountPicker amount={requestedAmount} onAdjust={adjustRequested} />
        </View>
        <View style={styles.limitRow}>
          <Text style={styles.limitLabel}>{t('checkout_creditAvailable')}</Text>
          <PriceText amount={creditLimit} size="md" />
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/checkout/otp', params: { purpose: 'creditLine' } })}
          accessibilityRole="button"
          accessibilityLabel={t('creditLine_submitApplication')}
          style={styles.submitButton}
        >
          <Text style={styles.submitLabel}>{t('creditLine_submitApplication')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  intro: { ...text.body, color: color.secondary, marginTop: space.md },
  pickerGap: { marginTop: space.lg },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: color.hairline,
  },
  limitLabel: { ...text.caption, color: color.secondary },
  submitButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: { ...text.bodySemi, color: color.paper },
  completedWrap: { alignItems: 'center', marginTop: space.xxl, gap: space.sm },
  completedIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: color.ripe,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTitle: { ...text.h1, color: color.ink },
  completedSub: { ...text.body, color: color.secondary, textAlign: 'center' },
  completedButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.md,
  },
  completedButtonLabel: { ...text.bodySemi, color: color.paper },
});

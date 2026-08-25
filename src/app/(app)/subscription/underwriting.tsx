import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, shadow, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { CheckIcon } from '@/components/icons';
import { UnderwritingHeader } from './_components/UnderwritingHeader';
import { TinInput } from './_components/TinInput';
import { PurposeChips, type PurposeOption } from './_components/PurposeChips';
import { FrequencyTiles, type FrequencyOption } from './_components/FrequencyTiles';
import { FirstTimeToggleRow } from './_components/FirstTimeToggleRow';
import { useT } from '@/i18n';
import { account } from '@/mocks';

/** Voucher application form: TIN, purpose, usage frequency and first-time status, then on to data authorization. */
export default function Underwriting() {
  const t = useT();
  const { colors } = useTheme();
  const { completed } = useLocalSearchParams<{ completed?: string }>();
  const [tin, setTin] = useState(account.tin);
  const [purpose, setPurpose] = useState<PurposeOption>('BRIDGE_CASH_FLOW');
  const [otherPurpose, setOtherPurpose] = useState('');
  const [firstTime, setFirstTime] = useState(true);
  const [frequency, setFrequency] = useState<FrequencyOption>('SOMETIMES');

  if (completed === '1') {
    return (
      <ScreenScroll>
        <View style={styles.completedWrap}>
          <View style={[styles.completedIcon, { backgroundColor: colors.ripe }]}>
            <CheckIcon size={24} color={colors.paper} />
          </View>
          <Text style={[styles.completedTitle, { color: colors.ink }]}>{t('underwriting_completedTitle')}</Text>
          <Text style={[styles.completedSub, { color: colors.secondary }]}>{t('underwriting_completedSub')}</Text>
          <Pressable
            onPress={() => router.replace({ pathname: '/(app)/(tabs)/wallet', params: { tab: 'vouchers' } })}
            accessibilityRole="button"
            accessibilityLabel={t('vouchers_startUsing')}
            style={[styles.completedButton, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.completedButtonLabel, { color: colors.paper }]}>{t('vouchers_startUsing')}</Text>
          </Pressable>
        </View>
      </ScreenScroll>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenScroll contentInsetBottom={100} applyTopInset={false}>
        <UnderwritingHeader />
        <View style={[styles.formCard, { backgroundColor: colors.paper }]}>
          <View style={styles.fields}>
            <TinInput value={tin} onChangeText={setTin} prefilled={Boolean(account.tin)} />
            <View>
              <Text style={[styles.label, { color: colors.ink }]}>{t('underwriting_reason')}</Text>
              <PurposeChips
                selected={purpose}
                onSelect={setPurpose}
                otherText={otherPurpose}
                onChangeOtherText={setOtherPurpose}
              />
            </View>
            <View>
              <Text style={[styles.label, { color: colors.ink }]}>{t('underwriting_frequency')}</Text>
              <FrequencyTiles selected={frequency} onSelect={setFrequency} />
            </View>
            <FirstTimeToggleRow value={firstTime} onChange={setFirstTime} />
          </View>
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/checkout/otp', params: { purpose: 'underwriting' } })}
          accessibilityRole="button"
          accessibilityLabel={t('underwriting_continueVerification')}
          style={[styles.button, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.buttonLabel, { color: colors.paper }]}>{t('underwriting_continueVerification')} →</Text>
        </Pressable>
        <Text style={[styles.footerNote, { color: colors.secondary }]}>{t('underwriting_noObligationNote')}</Text>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formCard: {
    marginTop: -24,
    marginHorizontal: space.lg,
    borderRadius: radius.lg,
    padding: space.lg,
    ...shadow.raised,
  },
  fields: { gap: space.lg },
  label: { ...text.label, marginBottom: space.sm },
  button: { minHeight: 48, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { ...text.bodySemi },
  footerNote: { ...text.micro, textAlign: 'center', marginTop: space.sm },
  completedWrap: { alignItems: 'center', marginTop: space.xxl, gap: space.sm },
  completedIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
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

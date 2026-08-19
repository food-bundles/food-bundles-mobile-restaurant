import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { CheckIcon } from '@/components/icons';
import { Input } from '@/components/primitives';
import { OptionRow } from './_components/OptionRow';
import { useT } from '@/i18n';
import { account } from '@/mocks';

type Frequency = 'RARELY' | 'SOMETIMES' | 'OFTEN';

export default function Underwriting() {
  const t = useT();
  const { colors } = useTheme();
  const { completed } = useLocalSearchParams<{ completed?: string }>();
  const [reason, setReason] = useState('Stock produce between supplier payouts');
  const [firstTime, setFirstTime] = useState(true);
  const [frequency, setFrequency] = useState<Frequency>('SOMETIMES');

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
      <ScreenHeader title={t('underwriting_title')} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.fields}>
          <Input label={t('underwriting_tin')} value={account.tin} onChangeText={() => undefined} editable={false} />
          <Input label={t('underwriting_reason')} value={reason} onChangeText={setReason} />
          <View>
            <Text style={[styles.label, { color: colors.ink }]}>{t('underwriting_firstTime')}</Text>
            <OptionRow
              options={[
                { value: 'yes', label: t('underwriting_yes') },
                { value: 'no', label: t('underwriting_no') },
              ]}
              selected={firstTime ? 'yes' : 'no'}
              onSelect={(value) => setFirstTime(value === 'yes')}
            />
          </View>
          <View>
            <Text style={[styles.label, { color: colors.ink }]}>{t('underwriting_frequency')}</Text>
            <OptionRow
              options={[
                { value: 'RARELY', label: t('underwriting_rarely') },
                { value: 'SOMETIMES', label: t('underwriting_sometimes') },
                { value: 'OFTEN', label: t('underwriting_veryOften') },
              ]}
              selected={frequency}
              onSelect={setFrequency}
            />
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
          <Text style={[styles.buttonLabel, { color: colors.paper }]}>{t('underwriting_continueVerification')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fields: { gap: space.lg, marginTop: space.md },
  label: { ...text.label, marginBottom: space.sm },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { ...text.bodySemi },
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

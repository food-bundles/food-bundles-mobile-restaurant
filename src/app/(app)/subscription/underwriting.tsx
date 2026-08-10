import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { CheckIcon } from '@/components/icons';
import { Input } from '@/components/primitives';
import { OptionRow } from './_components/OptionRow';
import { useT } from '@/i18n';
import { account } from '@/mocks';

type Frequency = 'RARELY' | 'SOMETIMES' | 'OFTEN';
type Duration = '30' | '60' | '90';

export default function Underwriting() {
  const t = useT();
  const { completed } = useLocalSearchParams<{ completed?: string }>();
  const [reason, setReason] = useState('Stock produce between supplier payouts');
  const [firstTime, setFirstTime] = useState(true);
  const [frequency, setFrequency] = useState<Frequency>('SOMETIMES');
  const [duration, setDuration] = useState<Duration>('60');

  if (completed === '1') {
    return (
      <ScreenScroll>
        <View style={styles.completedWrap}>
          <View style={styles.completedIcon}>
            <CheckIcon size={24} color={color.paper} />
          </View>
          <Text style={styles.completedTitle}>{t('underwriting_completedTitle')}</Text>
          <Text style={styles.completedSub}>{t('underwriting_completedSub')}</Text>
          <Pressable
            onPress={() => router.replace('/(app)/(tabs)/vouchers')}
            accessibilityRole="button"
            accessibilityLabel={t('vouchers_useAtCheckout')}
            style={styles.completedButton}
          >
            <Text style={styles.completedButtonLabel}>{t('vouchers_title')}</Text>
          </Pressable>
        </View>
      </ScreenScroll>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('underwriting_title')} />
      <ScreenScroll contentInsetBottom={80}>
        <View style={styles.fields}>
          <Input label={t('underwriting_tin')} value={account.tin} onChangeText={() => undefined} editable={false} />
          <Input label={t('underwriting_reason')} value={reason} onChangeText={setReason} />
          <View>
            <Text style={styles.label}>{t('underwriting_firstTime')}</Text>
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
            <Text style={styles.label}>{t('underwriting_frequency')}</Text>
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
          <View>
            <Text style={styles.label}>{t('underwriting_repaymentDuration')}</Text>
            <OptionRow
              options={[
                { value: '30', label: t('underwriting_days30') },
                { value: '60', label: t('underwriting_days60') },
                { value: '90', label: t('underwriting_days90') },
              ]}
              selected={duration}
              onSelect={setDuration}
            />
          </View>
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/checkout/otp', params: { purpose: 'underwriting' } })}
          accessibilityRole="button"
          accessibilityLabel={t('underwriting_continueVerification')}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>{t('underwriting_continueVerification')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  fields: { gap: space.lg, marginTop: space.md },
  label: { ...text.label, color: color.ink, marginBottom: space.sm },
  button: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { ...text.bodySemi, color: color.paper },
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

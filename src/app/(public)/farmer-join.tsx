import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll } from '@/components/layout';
import { Input } from '@/components/primitives';
import { ChevronLeftIcon } from '@/components/icons';
import { useT } from '@/i18n';

export default function FarmerJoin() {
  const t = useT();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [crops, setCrops] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0;

  return (
    <ScreenScroll>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={t('action_back')}
        style={styles.backButton}
      >
        <ChevronLeftIcon />
      </Pressable>
      <View style={styles.intro}>
        <Text style={styles.introTitle}>{t('farmer_title')}</Text>
        <Text style={styles.introText}>{t('farmer_intro')}</Text>
      </View>
      {submitted ? (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>{t('farmer_submitNote')}</Text>
        </View>
      ) : (
        <View style={styles.fields}>
          <Input label={t('farmer_name')} value={name} onChangeText={setName} />
          <Input label={t('farmer_phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label={t('farmer_district')} value={district} onChangeText={setDistrict} />
          <Input label={t('farmer_crops')} value={crops} onChangeText={setCrops} />
          <Pressable
            onPress={() => setSubmitted(true)}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel={t('farmer_submit')}
            style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
          >
            <Text style={styles.submitLabel}>{t('farmer_submit')}</Text>
          </Pressable>
          <Text style={styles.note}>{t('farmer_submitNote')}</Text>
        </View>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  intro: {
    backgroundColor: color.pine,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.sm,
  },
  introTitle: { ...text.h1, color: color.paper },
  introText: { ...text.body, color: color.onPineSoft, marginTop: space.sm },
  fields: { gap: space.md, marginTop: space.lg },
  submitButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: { opacity: 0.5 },
  submitLabel: { ...text.bodySemi, color: color.paper },
  note: { ...text.caption, color: color.muted, textAlign: 'center' },
  successCard: {
    backgroundColor: color.tintLeaf,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.lg,
  },
  successTitle: { ...text.bodySemi, color: color.pine, textAlign: 'center' },
});

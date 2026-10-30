import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { submitKycApi, type KycInput } from '@/api/voucher-card.api';

export default function KycScreen() {
  const { colors } = useTheme();

  const [ownerName, setOwnerName] = useState('');
  const [ownerNationalId, setOwnerNationalId] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [yearsInOperation, setYearsInOperation] = useState('');
  const [district, setDistrict] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [consentVubaBuba, setConsentVubaBuba] = useState(false);
  const [consentKayko, setConsentKayko] = useState(false);
  const [consentRRA, setConsentRRA] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!ownerName || !ownerNationalId || !businessType || !yearsInOperation) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!consentVubaBuba && !consentKayko && !consentRRA) {
      setError('You must consent to share data with at least one partner to proceed.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: KycInput = {
        restaurantName: '',
        tinNumber: '',
        phoneNumber: '',
        businessAddress,
        district,
        ownerName,
        ownerNationalId,
        businessType,
        yearsInOperation: Number(yearsInOperation),
        consentVubaBuba,
        consentKayko,
        consentRRA,
      };
      await submitKycApi(payload);
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to submit KYC. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title="KYC Consent" />
        <View style={styles.successWrap}>
          <Text style={[styles.successTitle, { color: colors.ink }]}>KYC Submitted</Text>
          <Text style={[styles.successSub, { color: colors.secondary }]}>
            Your KYC consent has been submitted and is pending review. Once approved, you can request your
            voucher card.
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.btn, { backgroundColor: colors.leaf }]}
          >
            <Text style={[styles.btnLabel, { color: colors.paper }]}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="KYC Consent" />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.intro, { color: colors.secondary }]}>
          Complete your Know Your Customer (KYC) verification to apply for a FoodBundles Voucher Card. Your
          information is shared only with approved partners.
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>OWNER INFORMATION</Text>
        <Input label="Owner Full Name *" value={ownerName} onChangeText={setOwnerName} placeholder="Jean Paul Habimana" />
        <Input
          label="National ID Number *"
          value={ownerNationalId}
          onChangeText={setOwnerNationalId}
          placeholder="1199XXXXXXXXX"
          keyboardType="numeric"
        />

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>BUSINESS INFORMATION</Text>
        <Input
          label="Business Type *"
          value={businessType}
          onChangeText={setBusinessType}
          placeholder="e.g. Restaurant, Catering"
        />
        <Input
          label="Years in Operation *"
          value={yearsInOperation}
          onChangeText={setYearsInOperation}
          keyboardType="numeric"
          placeholder="e.g. 3"
        />
        <Input
          label="District"
          value={district}
          onChangeText={setDistrict}
          placeholder="e.g. Gasabo"
        />
        <Input
          label="Business Address"
          value={businessAddress}
          onChangeText={setBusinessAddress}
          placeholder="e.g. KG 7 Ave, Kacyiru"
        />

        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>DATA SHARING CONSENT</Text>
        <Text style={[styles.consentDesc, { color: colors.secondary }]}>
          To determine your credit eligibility, FoodBundles shares your business data with trusted partners.
          Please select the partners you consent to share with:
        </Text>

        {[
          { key: 'consentVubaBuba', label: 'VubaBuba (Credit Scoring)', value: consentVubaBuba, onChange: setConsentVubaBuba },
          { key: 'consentKayko', label: 'Kayko (Business Verification)', value: consentKayko, onChange: setConsentKayko },
          { key: 'consentRRA', label: 'RRA (Tax Compliance Check)', value: consentRRA, onChange: setConsentRRA },
        ].map((item) => (
          <View key={item.key} style={[styles.consentRow, { borderColor: colors.hairline }]}>
            <Text style={[styles.consentLabel, { color: colors.ink }]}>{item.label}</Text>
            <Switch
              value={item.value}
              onValueChange={item.onChange}
              trackColor={{ false: colors.hairline, true: colors.leaf }}
              thumbColor={colors.paper}
            />
          </View>
        ))}

        {error ? <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text> : null}

        <Pressable
          onPress={onSubmit}
          disabled={submitting}
          style={[styles.btn, { backgroundColor: colors.leaf, marginTop: space.lg }, submitting && styles.disabled]}
        >
          {submitting ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Text style={[styles.btnLabel, { color: colors.paper }]}>Submit KYC</Text>
          )}
        </Pressable>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.caption, marginTop: space.sm, marginBottom: space.md, lineHeight: 20 },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  consentDesc: { ...text.caption, marginBottom: space.sm, lineHeight: 20 },
  consentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: space.sm,
  },
  consentLabel: { ...text.body, flex: 1, marginRight: space.sm },
  btn: { minHeight: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  btnLabel: { ...text.bodySemi },
  disabled: { opacity: 0.5 },
  errorText: { ...text.caption, textAlign: 'center', marginTop: space.sm },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl, gap: space.md },
  successTitle: { ...text.h2, textAlign: 'center' },
  successSub: { ...text.body, textAlign: 'center', lineHeight: 22 },
});

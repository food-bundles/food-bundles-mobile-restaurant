import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { request } from '@/api/client';

interface AppliedPromo {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description?: string;
}

export default function PromoCodes() {
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedPromo | null>(null);

  const onApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || applying) return;
    setApplying(true);
    setError(null);
    try {
      const res = await request<{ data: AppliedPromo }>('/promo/apply', {
        method: 'POST',
        body: { code: trimmed },
      });
      setApplied(res.data);
      setCode('');
    } catch (err: any) {
      setError(err?.message ?? 'Invalid promo code. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title="Promo Codes" />
      <ScreenScroll contentInsetBottom={40}>
        <Text style={[styles.intro, { color: colors.secondary }]}>
          Enter a promo code to get a discount on your next order.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <Input
            label="Promo Code"
            value={code}
            onChangeText={(v) => { setCode(v.toUpperCase()); setError(null); }}
            placeholder="e.g. WELCOME20"
          />
          {error ? (
            <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text>
          ) : null}
          <Pressable
            onPress={onApply}
            disabled={!code.trim() || applying}
            accessibilityRole="button"
            style={[
              styles.applyButton,
              { backgroundColor: colors.leaf },
              (!code.trim() || applying) && styles.buttonDisabled,
            ]}
          >
            {applying ? (
              <ActivityIndicator color={colors.paper} />
            ) : (
              <Text style={[styles.applyLabel, { color: colors.paper }]}>Apply Code</Text>
            )}
          </Pressable>
        </View>

        {applied ? (
          <View style={[styles.successCard, { backgroundColor: colors.tintLeaf, borderColor: colors.leaf }]}>
            <Text style={[styles.successTitle, { color: colors.pine }]}>Code Applied!</Text>
            <Text style={[styles.successCode, { color: colors.leaf }]}>{applied.code}</Text>
            {applied.description ? (
              <Text style={[styles.successDesc, { color: colors.secondary }]}>{applied.description}</Text>
            ) : null}
            {applied.discountPercent ? (
              <Text style={[styles.discountText, { color: colors.pine }]}>
                {applied.discountPercent}% off your order
              </Text>
            ) : applied.discountAmount ? (
              <Text style={[styles.discountText, { color: colors.pine }]}>
                {applied.discountAmount.toLocaleString()} RWF off your order
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={[styles.infoCard, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <Text style={[styles.infoTitle, { color: colors.ink }]}>How promo codes work</Text>
          <Text style={[styles.infoText, { color: colors.secondary }]}>
            • Promo codes are applied at checkout{'\n'}
            • Each code can only be used once per account{'\n'}
            • Codes cannot be combined with other offers{'\n'}
            • Contact support if you have trouble using a code
          </Text>
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.caption, marginTop: space.sm, marginBottom: space.md },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.md, gap: space.md },
  errorText: { ...text.caption },
  applyButton: {
    minHeight: hit.min,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  applyLabel: { ...text.bodySemi },
  successCard: {
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.md,
    gap: space.xs,
  },
  successTitle: { ...text.overline },
  successCode: { ...text.h2 },
  successDesc: { ...text.caption },
  discountText: { ...text.bodySemi, marginTop: space.xs },
  infoCard: { borderWidth: 1, borderRadius: radius.lg, padding: space.md, marginTop: space.md, gap: space.sm },
  infoTitle: { ...text.bodySemi },
  infoText: { ...text.caption, lineHeight: 22 },
});

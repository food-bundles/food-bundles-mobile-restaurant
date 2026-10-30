import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, space, text, useTheme } from '@/theme';
import { useSessionStore } from '@/stores/sessionStore';

export default function TermsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const acceptTerms = useSessionStore((s) => s.acceptTerms);

  const handleAccept = () => {
    acceptTerms();
    router.replace('/(app)/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.hairline }]}>
        <Text style={[styles.title, { color: colors.ink }]}>Terms & Conditions</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          Please read and accept before continuing
        </Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>1. Use of the Platform</Text>
        <Text style={[styles.body, { color: colors.secondary }]}>
          FoodBundles provides a platform for restaurants and hotels to order produce and food supplies. By using this app, you agree to use it solely for legitimate business purposes.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>2. Account Responsibility</Text>
        <Text style={[styles.body, { color: colors.secondary }]}>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify FoodBundles immediately of any unauthorized use.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>3. Orders & Payments</Text>
        <Text style={[styles.body, { color: colors.secondary }]}>
          All orders placed through the platform are binding. Payment must be completed using one of the supported methods. FoodBundles reserves the right to cancel orders that cannot be fulfilled.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>4. Wallet & Top-Up</Text>
        <Text style={[styles.body, { color: colors.secondary }]}>
          Wallet balances are non-transferable and non-refundable except as required by applicable law. Top-up amounts reflect the value loaded via a confirmed payment gateway transaction.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>5. Subscriptions & Vouchers</Text>
        <Text style={[styles.body, { color: colors.secondary }]}>
          Subscription plans renew automatically unless cancelled before the renewal date. Vouchers are issued under separate terms and are subject to availability and eligibility criteria.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>6. Privacy</Text>
        <Text style={[styles.body, { color: colors.secondary }]}>
          FoodBundles collects and processes your business information in accordance with its Privacy Policy. By using the platform you consent to this processing.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>7. Changes to Terms</Text>
        <Text style={[styles.body, { color: colors.secondary }]}>
          FoodBundles may update these terms at any time. Continued use of the platform after changes are published constitutes acceptance of the updated terms.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md, backgroundColor: colors.oat, borderTopColor: colors.hairline }]}>
        <Pressable
          onPress={handleAccept}
          accessibilityRole="button"
          accessibilityLabel="Accept and continue"
          style={[styles.acceptButton, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.acceptLabel, { color: colors.paper }]}>Accept & Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: space.lg, paddingVertical: space.lg, borderBottomWidth: 1 },
  title: { ...text.h1 },
  subtitle: { ...text.caption, marginTop: space.xs },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: space.lg, paddingTop: space.lg },
  sectionTitle: { ...text.bodySemi, marginTop: space.lg, marginBottom: space.xs },
  body: { ...text.body, lineHeight: 22 },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: 1 },
  acceptButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptLabel: { ...text.bodySemi },
});

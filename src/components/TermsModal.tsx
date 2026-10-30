import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { radius, space, text, useTheme } from '@/theme';

type Tab = 'terms' | 'privacy' | 'refund';

const TABS: { key: Tab; label: string }[] = [
  { key: 'terms', label: 'Terms' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'refund', label: 'Refund' },
];

interface Section {
  heading: string;
  body: string;
}

const TERMS: Section[] = [
  {
    heading: 'Introduction',
    body: 'By registering for or signing up on the Food Bundles platform you acknowledge that you have read, understood, and accepted the terms of this Agreement. Your continued use of the platform confirms your acceptance.',
  },
  {
    heading: '1. Purpose & Scope',
    body: 'This Agreement governs the Restaurant\'s use of the Food Bundles platform for sourcing, ordering, and receiving delivery of fresh food and related products, including options for postpayment, instant payment, and subscription-based services.',
  },
  {
    heading: '2. Platform Access & Registration',
    body: 'Restaurants may register for a Food Bundles account online or through authorized agents. By default, all Restaurants are enrolled in the Freemium Package, which allows immediate purchase and payment for orders. Restaurants may upgrade to paid subscription packages, unlocking additional features such as order postpayment options, extended delivery benefits, and other exclusive services.',
  },
  {
    heading: '3. Orders, Payment & Delivery',
    body: 'Restaurants may place orders for fresh food and inventory using the platform. Payment can be made via available payment methods. For Freemium Package users, payment must be made in full at the time of order placement. Delivery is free for orders above 100,000 RWF or for Restaurants under a paid subscription package. Upon delivery, the Restaurant shall inspect the goods and confirm receipt. Any defects must be reported at the time of delivery.',
  },
  {
    heading: '4. Postpayment (Paid Subscription Only)',
    body: 'Only available to Restaurants with an active subscription package that includes postpayment. Postpayment periods range from 7 to 30 days. No interest is charged for postpayment; eligibility is based on subscription status. Approval is at Food Bundles\' sole discretion.',
  },
  {
    heading: '5. Payment & Settlement',
    body: 'For postpayment orders, restaurants must settle the full invoiced amount within the period specified by Food Bundles. Failure to pay within the agreed period may result in suspension of postpayment privileges and may be reported to the Credit Reference Bureau (CRB).',
  },
  {
    heading: '6. Anti-Fraud & Compliance',
    body: 'Restaurants agree not to use the Food Bundles platform for any unlawful, fraudulent, or money laundering activities. Food Bundles reserves the right to monitor transactions, suspend accounts, and report suspicious activity to relevant authorities.',
  },
  {
    heading: '7. Privacy & Data Protection',
    body: 'Food Bundles collects and processes Restaurant data solely for account management, order fulfillment, compliance, and customer support. Restaurants have the right to access, correct, or request deletion of their data, subject to legal and operational requirements.',
  },
  {
    heading: '8. Amendments & Termination',
    body: 'This Agreement is effective upon Restaurant\'s registration. Food Bundles may amend these terms at any time, with notice to Users via the platform. Food Bundles may suspend or terminate access for violation of these terms.',
  },
  {
    heading: '9. Governing Law',
    body: 'This Agreement is governed by the laws of the Republic of Rwanda.',
  },
];

const PRIVACY: Section[] = [
  {
    heading: '1. Overview',
    body: 'Food Bundles Limited respects your privacy and is committed to protecting the personal data you provide when you register for, or use, our platform.',
  },
  {
    heading: '2. Information We Collect',
    body: 'Account details such as your name, business name, email address, phone number, TIN and business type. Location information including province, district, sector, cell and village. Payment information needed to process transactions securely. Transaction and order records made through the platform.',
  },
  {
    heading: '3. How We Use Your Information',
    body: 'Account management, verification and authentication. Order placement, fulfilment, payment processing and delivery. Customer support and responding to your inquiries. Compliance with legal, regulatory and tax obligations, and the prevention of fraud and money laundering. Platform improvement, analytics and security.',
  },
  {
    heading: '4. Sharing of Information',
    body: 'We do not sell your personal data. We only share information where necessary to operate the platform, including with payment processors, delivery and logistics partners, and government or regulatory authorities where required by law.',
  },
  {
    heading: '5. Data Security',
    body: 'We implement reasonable technical and organizational security measures to protect your personal data from unauthorized access, use, alteration, disclosure or loss.',
  },
  {
    heading: '6. Your Rights',
    body: 'Subject to applicable law, you have the right to access the personal data we hold about you, correct or update inaccurate information, request deletion subject to legal requirements. Contact us at info@food.rw to exercise these rights.',
  },
];

const REFUND: Section[] = [
  {
    heading: '1. How Refunds Are Issued',
    body: 'Refunds are issued by topping up the refunded amount to your Food Bundles wallet balance. Once approved, the wallet top-up is processed within 7 days. Refunds are recorded in your transaction history.',
  },
  {
    heading: '2. When You Can Request a Refund',
    body: 'You must report any refund issue immediately upon delivery, while our logistics staff are still present at your location. If the issue is not reported at the time of delivery, you will not be able to report a refund for that order.',
  },
  {
    heading: '3. What Refunds Do Not Cover',
    body: 'Issues not reported at the time of delivery. Products that were accepted at delivery. Issues reported after our logistics staff have left the delivery location. Losses caused by misuse or negligence.',
  },
  {
    heading: '4. Contact',
    body: 'To initiate a refund request, contact our support team at +250 796 897 823 (phone/WhatsApp) or sales@food.rw with your order details.',
  },
];

const CONTENT: Record<Tab, Section[]> = {
  terms: TERMS,
  privacy: PRIVACY,
  refund: REFUND,
};

interface Props {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export default function TermsModal({ visible, onAccept, onClose }: Props) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('terms');
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sections = CONTENT[activeTab];

  async function handleAccept() {
    if (!accepted || submitting) return;
    setSubmitting(true);
    try {
      await onAccept();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.paper }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.hairline }]}>
          <Text style={[styles.headerTitle, { color: colors.ink }]}>Terms & Conditions</Text>
          <Text style={[styles.headerSubtitle, { color: colors.secondary }]}>
            Please read and accept before continuing
          </Text>
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { borderBottomColor: colors.hairline }]}>
          {TABS.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[styles.tab, active && { borderBottomColor: colors.leaf, borderBottomWidth: 2 }]}
              >
                <Text style={[styles.tabText, { color: active ? colors.leaf : colors.secondary }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          {sections.map((section, i) => (
            <View key={i} style={styles.section}>
              <Text style={[styles.sectionHeading, { color: colors.ink }]}>{section.heading}</Text>
              <Text style={[styles.sectionBody, { color: colors.secondary }]}>{section.body}</Text>
            </View>
          ))}

          <View style={[styles.companyInfo, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            <Text style={[styles.companyTitle, { color: colors.ink }]}>Food Bundles Limited</Text>
            <Text style={[styles.companyText, { color: colors.secondary }]}>TIN 112265383 · Incorporated in Rwanda</Text>
            <Text style={[styles.companyText, { color: colors.secondary }]}>KG 5 Ave, Kigali, Rwanda</Text>
            <Text style={[styles.companyText, { color: colors.secondary }]}>info@food.rw · +250 788 963 267</Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.hairline, backgroundColor: colors.paper }]}>
          <Pressable
            onPress={() => setAccepted((a) => !a)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: accepted }}
            style={styles.checkRow}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: accepted ? colors.leaf : colors.hairline,
                  backgroundColor: accepted ? colors.leaf : 'transparent',
                },
              ]}
            >
              {accepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkLabel, { color: colors.ink }]}>
              I have read and agree to the Terms & Conditions, Privacy Policy, and Refund Policy.
            </Text>
          </Pressable>

          <Pressable
            onPress={handleAccept}
            disabled={!accepted || submitting}
            accessibilityRole="button"
            style={[
              styles.acceptButton,
              { backgroundColor: colors.leaf },
              (!accepted || submitting) && styles.acceptDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.acceptLabel}>Accept & Continue</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
    borderBottomWidth: 1,
  },
  headerTitle: { ...text.h2 },
  headerSubtitle: { ...text.caption, marginTop: space.xs },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: space.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.sm,
    marginBottom: -1,
  },
  tabText: { ...text.bodySemi, fontSize: 13 },
  scroll: { flex: 1 },
  scrollContent: { padding: space.lg, gap: space.md },
  section: { gap: space.xs },
  sectionHeading: { ...text.bodySemi },
  sectionBody: { ...text.body, lineHeight: 22 },
  companyInfo: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: space.sm,
    gap: space.xs,
  },
  companyTitle: { ...text.bodySemi },
  companyText: { ...text.caption },
  footer: {
    padding: space.lg,
    gap: space.md,
    borderTopWidth: 1,
  },
  checkRow: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  checkLabel: { ...text.caption, flex: 1, lineHeight: 20 },
  acceptButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptDisabled: { opacity: 0.5 },
  acceptLabel: { color: '#fff', ...text.bodySemi },
});

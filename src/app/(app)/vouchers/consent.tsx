import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import {
  CheckIcon,
  DeliveryBagIcon,
  LockShieldIcon,
  LogoMark,
  PosTerminalIcon,
  PowerBoltIcon,
  ReceiptIcon,
  ShieldIcon,
} from '@/components/icons';
import { ConsentSourceCard } from './_components/ConsentSourceCard';
import { ConsentOtpSheet } from './_components/ConsentOtpSheet';
import { useVouchersStore } from '@/stores';
import { useT } from '@/i18n';
import type { DataConsentSource } from '@/mocks/types';

const SOURCE_ORDER: DataConsentSource[] = ['eucl', 'rra', 'vubaVuba', 'kayko', 'foodbundles', 'creditBureau'];

const SOURCE_ICON: Record<DataConsentSource, (color: string) => React.ReactNode> = {
  eucl: (color) => <PowerBoltIcon color={color} />,
  rra: (color) => <ReceiptIcon color={color} />,
  vubaVuba: (color) => <DeliveryBagIcon color={color} />,
  kayko: (color) => <PosTerminalIcon color={color} />,
  foodbundles: () => <LogoMark size={24} />,
  creditBureau: (color) => <ShieldIcon color={color} />,
};

/** Step 1 of the voucher application flow: authorize the third-party data sources used to size the credit limit. */
export default function VoucherConsent() {
  const t = useT();
  const { colors } = useTheme();
  const { sources: sourcesParam } = useLocalSearchParams<{ sources?: string }>();
  const consentList = useVouchersStore((state) => state.consentList);
  const setConsent = useVouchersStore((state) => state.setConsent);
  const [acknowledged, setAcknowledged] = useState(false);
  const [pendingSource, setPendingSource] = useState<DataConsentSource | null>(null);

  const filter = sourcesParam ? new Set(sourcesParam.split(',')) : null;
  const visibleSources = filter ? SOURCE_ORDER.filter((source) => filter.has(source)) : SOURCE_ORDER;

  const onToggle = (source: DataConsentSource, granted: boolean) => {
    if (granted) {
      setConsent(source, false);
      return;
    }
    setPendingSource(source);
  };

  const onOtpConfirmed = (source: DataConsentSource) => {
    setConsent(source, true);
    setPendingSource(null);
  };

  const onContinue = () => {
    router.push('/(app)/subscription/underwriting');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenScroll contentInsetBottom={140}>
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]}>
            <LockShieldIcon size={26} color={colors.leaf} />
          </View>
          <Text style={[styles.title, { color: colors.ink }]}>{t('consent_title')}</Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>{t('consent_subtitle')}</Text>
        </View>
        {visibleSources.map((source) => {
          const consent = consentList.find((c) => c.source === source);
          return (
            <ConsentSourceCard
              key={source}
              source={source}
              icon={SOURCE_ICON[source](colors.leaf)}
              granted={consent?.granted ?? false}
              locked={source === 'foodbundles'}
              onToggle={() => onToggle(source, consent?.granted ?? false)}
            />
          );
        })}
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => setAcknowledged((prev) => !prev)}
          accessibilityRole="switch"
          accessibilityState={{ checked: acknowledged }}
          accessibilityLabel={t('consent_acknowledgement')}
          style={styles.checkboxRow}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.disabledLine },
              acknowledged && { backgroundColor: colors.leaf, borderColor: colors.leaf },
            ]}
          >
            {acknowledged ? <CheckIcon size={12} /> : null}
          </View>
          <Text style={[styles.checkboxLabel, { color: colors.body }]}>{t('consent_acknowledgement')}</Text>
        </Pressable>
        <Pressable
          onPress={onContinue}
          disabled={!acknowledged}
          accessibilityRole="button"
          accessibilityLabel={t('consent_continue')}
          style={[styles.continueButton, { backgroundColor: colors.leaf }, !acknowledged && styles.disabled]}
        >
          <Text style={[styles.continueLabel, { color: colors.paper }]}>{t('consent_continue')} →</Text>
        </Pressable>
        <Text style={[styles.hint, { color: colors.secondary }]}>{t('consent_moreSourcesHint')}</Text>
      </StickyFooter>
      <ConsentOtpSheet source={pendingSource} onClose={() => setPendingSource(null)} onConfirmed={onOtpConfirmed} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', marginTop: space.lg, marginBottom: space.lg, paddingHorizontal: space.md },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  title: { ...text.h1, textAlign: 'center' },
  subtitle: { ...text.body, textAlign: 'center', marginTop: space.xs },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, marginBottom: space.md },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: { ...text.caption, flex: 1 },
  continueButton: { minHeight: 48, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  continueLabel: { ...text.bodySemi },
  hint: { ...text.micro, textAlign: 'center', marginTop: space.sm },
});

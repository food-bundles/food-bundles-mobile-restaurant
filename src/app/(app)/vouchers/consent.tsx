import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import {
  CheckIcon,
  DeliveryBagIcon,
  LockShieldIcon,
  PosTerminalIcon,
  PowerBoltIcon,
  ReceiptIcon,
  ShieldIcon,
} from '@/components/icons';
import { SourceTile } from './_components/SourceTile';
import { LimitPreviewBar } from './_components/LimitPreviewBar';
import { AlwaysIncludedRow } from './_components/AlwaysIncludedRow';
import { ConsentOtpSheet } from './_components/ConsentOtpSheet';
import { useVouchersStore } from '@/stores';
import { BASE_LIMIT_RWF, SOURCE_CONTRIBUTION, TOGGLEABLE_SOURCES } from '@/lib';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import type { DataConsentSource } from '@/mocks/types';

type ToggleableSource = Exclude<DataConsentSource, 'foodbundles'>;

const SOURCE_ICON: Record<ToggleableSource, (color: string) => React.ReactNode> = {
  eucl: (color) => <PowerBoltIcon color={color} />,
  rra: (color) => <ReceiptIcon color={color} />,
  vubaVuba: (color) => <DeliveryBagIcon color={color} />,
  kayko: (color) => <PosTerminalIcon color={color} />,
  creditBureau: (color) => <ShieldIcon color={color} />,
};

const NAME_KEY: Record<DataConsentSource, TranslationKey> = {
  eucl: 'consent_euclName',
  rra: 'consent_rraName',
  vubaVuba: 'consent_vubaName',
  kayko: 'consent_kaykoName',
  foodbundles: 'consent_foodbundlesName',
  creditBureau: 'consent_bureauName',
};

const DESCRIPTION_KEY: Record<ToggleableSource, TranslationKey> = {
  eucl: 'consent_euclDescription',
  rra: 'consent_rraDescription',
  vubaVuba: 'consent_vubaDescription',
  kayko: 'consent_kaykoDescription',
  creditBureau: 'consent_bureauDescription',
};

const MAX_LIMIT_RWF = BASE_LIMIT_RWF + TOGGLEABLE_SOURCES.reduce((sum, s) => sum + SOURCE_CONTRIBUTION[s], 0);

/** Step 1 of the voucher application flow: authorize the third-party data sources used to size the credit limit. */
export default function VoucherConsent() {
  const t = useT();
  const { colors } = useTheme();
  const { sources: sourcesParam } = useLocalSearchParams<{ sources?: string }>();
  const setConsent = useVouchersStore((state) => state.setConsent);
  const [acknowledged, setAcknowledged] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);

  const filter = sourcesParam ? new Set(sourcesParam.split(',')) : null;
  const visibleSources = filter
    ? TOGGLEABLE_SOURCES.filter((source) => filter.has(source))
    : TOGGLEABLE_SOURCES;

  const [selected, setSelected] = useState<Set<ToggleableSource>>(new Set());

  const toggleSource = (source: ToggleableSource) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  };

  const onSelectAll = () => setSelected(new Set(visibleSources));

  const estimatedLimit =
    BASE_LIMIT_RWF + Array.from(selected).reduce((sum, source) => sum + SOURCE_CONTRIBUTION[source], 0);

  const onOtpConfirmed = () => {
    for (const source of selected) setConsent(source, true);
    setOtpOpen(false);
    router.push('/(app)/subscription/underwriting');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenScroll contentInsetBottom={160}>
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: colors.tintLeaf }]}>
            <LockShieldIcon size={26} color={colors.leaf} />
          </View>
          <Text style={[styles.title, { color: colors.ink }]}>{t('consent_title')}</Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>{t('consent_subtitle')}</Text>
          <LimitPreviewBar limitRwf={estimatedLimit} maxLimitRwf={MAX_LIMIT_RWF} />
        </View>

        <AlwaysIncludedRow name={t(NAME_KEY.foodbundles)} />

        <View style={styles.gridHeaderRow}>
          <Text style={[styles.gridLabel, { color: colors.secondary }]}>{t('consent_otherSources')}</Text>
          <Pressable onPress={onSelectAll} accessibilityRole="button" accessibilityLabel={t('consent_selectAll')} style={styles.selectAllHit}>
            <Text style={[styles.selectAllLabel, { color: colors.leaf }]}>{t('consent_selectAll')}</Text>
          </Pressable>
        </View>
        <View style={styles.grid}>
          {visibleSources.map((source) => (
            <SourceTile
              key={source}
              icon={SOURCE_ICON[source](colors.leaf)}
              name={t(NAME_KEY[source])}
              descriptionKey={DESCRIPTION_KEY[source]}
              contributionRwf={SOURCE_CONTRIBUTION[source]}
              selected={selected.has(source)}
              onToggle={() => toggleSource(source)}
            />
          ))}
        </View>
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
          onPress={() => setOtpOpen(true)}
          disabled={!acknowledged || selected.size === 0}
          accessibilityRole="button"
          accessibilityLabel={t('consent_continue')}
          style={[
            styles.continueButton,
            { backgroundColor: colors.leaf },
            (!acknowledged || selected.size === 0) && styles.disabled,
          ]}
        >
          <Text style={[styles.continueLabel, { color: colors.paper }]}>{t('consent_continue')} →</Text>
        </Pressable>
        <Text style={[styles.hint, { color: colors.secondary }]}>{t('consent_moreSourcesHint')}</Text>
      </StickyFooter>
      <ConsentOtpSheet visible={otpOpen} onClose={() => setOtpOpen(false)} onConfirmed={onOtpConfirmed} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', marginTop: space.lg, marginBottom: space.lg, paddingHorizontal: space.md },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  title: { ...text.h1, textAlign: 'center' },
  subtitle: { ...text.body, textAlign: 'center', marginTop: space.xs },
  gridHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridLabel: { ...text.overline },
  selectAllHit: { minHeight: hit.min, justifyContent: 'center' },
  selectAllLabel: { ...text.label },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.sm },
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
  continueButton: { minHeight: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  continueLabel: { ...text.bodySemi },
  hint: { ...text.micro, textAlign: 'center', marginTop: space.sm },
});

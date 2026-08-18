import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, StickyFooter, ScreenHeader } from '@/components/layout';
import { CheckIcon } from '@/components/icons';
import { useSessionStore } from '@/stores';
import { useT } from '@/i18n';
import type { Tier } from '@/mocks/types';

export default function Terms() {
  const t = useT();
  const { colors } = useTheme();
  const { tier } = useLocalSearchParams<{ tier?: Exclude<Tier, 'NONE'> }>();
  const acceptTerms = useSessionStore((state) => state.acceptTerms);
  const setTier = useSessionStore((state) => state.setTier);
  const [checked, setChecked] = useState(false);

  const onAccept = () => {
    acceptTerms();
    if (tier) setTier(tier);
    router.push('/(app)/subscription/underwriting');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('terms_title')} />
      <ScreenScroll contentInsetBottom={100}>
        <Text style={[styles.intro, { color: colors.body }]}>{t('terms_intro')}</Text>
        <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('terms_section1Title')}</Text>
          <Text style={[styles.body, { color: colors.body }]}>{t('terms_section1Body')}</Text>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('terms_section2Title')}</Text>
          <Text style={[styles.body, { color: colors.body }]}>{t('terms_section2Body')}</Text>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>{t('terms_section3Title')}</Text>
          <Text style={[styles.body, { color: colors.body }]}>{t('terms_section3Body')}</Text>
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={() => setChecked((prev) => !prev)}
          accessibilityRole="switch"
          accessibilityState={{ checked }}
          accessibilityLabel={t('terms_acceptCheckbox')}
          style={styles.checkboxRow}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.disabledLine },
              checked && { backgroundColor: colors.leaf, borderColor: colors.leaf },
            ]}
          >
            {checked ? <CheckIcon size={12} /> : null}
          </View>
          <Text style={[styles.checkboxLabel, { color: colors.body }]}>{t('terms_acceptCheckbox')}</Text>
        </Pressable>
        <Pressable
          onPress={onAccept}
          disabled={!checked}
          accessibilityRole="button"
          accessibilityLabel={t('terms_acceptContinue')}
          style={[styles.acceptButton, { backgroundColor: colors.leaf }, !checked && styles.acceptDisabled]}
        >
          <Text style={[styles.acceptLabel, { color: colors.paper }]}>{t('terms_acceptContinue')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  intro: { ...text.body, marginTop: space.md },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.md,
  },
  sectionTitle: { ...text.h2, marginTop: space.sm },
  body: { ...text.body, marginTop: space.xs },
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
  acceptButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptDisabled: { opacity: 0.5 },
  acceptLabel: { ...text.bodySemi },
});

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { ScreenScroll, StickyFooter } from '@/components/layout';
import { ChevronLeftIcon, CheckIcon } from '@/components/icons';
import { useSessionStore } from '@/stores';
import { useT } from '@/i18n';
import type { Tier } from '@/mocks/types';

export default function Terms() {
  const t = useT();
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
          style={styles.backButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <Text style={styles.title}>{t('terms_title')}</Text>
      </View>
      <ScreenScroll contentInsetBottom={100}>
        <Text style={styles.intro}>{t('terms_intro')}</Text>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('terms_section1Title')}</Text>
          <Text style={styles.body}>{t('terms_section1Body')}</Text>
          <Text style={styles.sectionTitle}>{t('terms_section2Title')}</Text>
          <Text style={styles.body}>{t('terms_section2Body')}</Text>
          <Text style={styles.sectionTitle}>{t('terms_section3Title')}</Text>
          <Text style={styles.body}>{t('terms_section3Body')}</Text>
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
          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked ? <CheckIcon size={12} /> : null}
          </View>
          <Text style={styles.checkboxLabel}>{t('terms_acceptCheckbox')}</Text>
        </Pressable>
        <Pressable
          onPress={onAccept}
          disabled={!checked}
          accessibilityRole="button"
          accessibilityLabel={t('terms_acceptContinue')}
          style={[styles.acceptButton, !checked && styles.acceptDisabled]}
        >
          <Text style={styles.acceptLabel}>{t('terms_acceptContinue')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.oat },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  backButton: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...text.h2, color: color.ink },
  intro: { ...text.body, color: color.body, marginTop: space.md },
  card: {
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.lg,
    padding: space.lg,
    marginTop: space.md,
  },
  sectionTitle: { ...text.h2, color: color.ink, marginTop: space.sm },
  body: { ...text.body, color: color.body, marginTop: space.xs },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, marginBottom: space.md },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: color.disabledLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: color.leaf, borderColor: color.leaf },
  checkboxLabel: { ...text.caption, color: color.body, flex: 1 },
  acceptButton: {
    minHeight: 48,
    backgroundColor: color.leaf,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptDisabled: { opacity: 0.5 },
  acceptLabel: { ...text.bodySemi, color: color.paper },
});

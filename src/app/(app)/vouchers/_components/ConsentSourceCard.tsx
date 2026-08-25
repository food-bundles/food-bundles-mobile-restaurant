import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import type { DataConsentSource } from '@/mocks/types';

export interface ConsentSourceCardProps {
  source: DataConsentSource;
  icon: React.ReactNode;
  granted: boolean;
  locked?: boolean;
  onToggle: () => void;
}

const BULLET_KEYS: Record<DataConsentSource, TranslationKey[]> = {
  eucl: ['consent_euclBullet1', 'consent_euclBullet2'],
  rra: ['consent_rraBullet1', 'consent_rraBullet2', 'consent_rraBullet3'],
  vubaVuba: ['consent_vubaBullet1', 'consent_vubaBullet2', 'consent_vubaBullet3'],
  kayko: ['consent_kaykoBullet1', 'consent_kaykoBullet2'],
  foodbundles: ['consent_foodbundlesBullet1', 'consent_foodbundlesBullet2'],
  creditBureau: ['consent_bureauBullet1', 'consent_bureauBullet2'],
};

const NAME_KEY: Record<DataConsentSource, TranslationKey> = {
  eucl: 'consent_euclName',
  rra: 'consent_rraName',
  vubaVuba: 'consent_vubaName',
  kayko: 'consent_kaykoName',
  foodbundles: 'consent_foodbundlesName',
  creditBureau: 'consent_bureauName',
};

const DESCRIPTION_KEY: Record<DataConsentSource, TranslationKey> = {
  eucl: 'consent_euclDescription',
  rra: 'consent_rraDescription',
  vubaVuba: 'consent_vubaDescription',
  kayko: 'consent_kaykoDescription',
  foodbundles: 'consent_foodbundlesDescription',
  creditBureau: 'consent_bureauDescription',
};

const HELPS_KEY: Record<DataConsentSource, TranslationKey> = {
  eucl: 'consent_euclHelps',
  rra: 'consent_rraHelps',
  vubaVuba: 'consent_vubaHelps',
  kayko: 'consent_kaykoHelps',
  foodbundles: 'consent_foodbundlesHelps',
  creditBureau: 'consent_bureauHelps',
};

/** One toggleable data-source card on the voucher consent screen. */
export function ConsentSourceCard({ source, icon, granted, locked, onToggle }: ConsentSourceCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const name = t(NAME_KEY[source]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.paper, borderLeftColor: colors.leaf },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.logoWrap, { backgroundColor: colors.tintLeaf }]}>{icon}</View>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.ink }]}>{name}</Text>
          <Text style={[styles.description, { color: colors.secondary }]}>{t(DESCRIPTION_KEY[source])}</Text>
        </View>
        <Pressable
          onPress={onToggle}
          disabled={locked}
          accessibilityRole="switch"
          accessibilityState={{ checked: granted, disabled: locked }}
          accessibilityLabel={name}
          style={styles.switchHit}
        >
          <View style={[styles.track, { backgroundColor: granted ? colors.leaf : colors.disabledLine }]}>
            <View style={[styles.thumb, { backgroundColor: colors.paper }, granted && styles.thumbOn]} />
          </View>
        </Pressable>
      </View>
      <Text style={[styles.bulletsLabel, { color: colors.secondary }]}>{t('consent_whatWeCollect')}</Text>
      {BULLET_KEYS[source].map((key) => (
        <Text key={key} style={[styles.bullet, { color: colors.secondary }]}>
          {'• '}
          {t(key)}
        </Text>
      ))}
      <Text style={[styles.helps, { color: colors.leaf }]}>{t(HELPS_KEY[source])}</Text>
      {locked ? <Text style={[styles.lockedLabel, { color: colors.secondary }]}>{t('consent_alwaysIncluded')}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderLeftWidth: 3,
    padding: space.md,
    marginBottom: space.sm,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  name: { ...text.bodySemi },
  description: { ...text.caption, marginTop: 2 },
  switchHit: { width: hit.min, height: hit.min, alignItems: 'center', justifyContent: 'center' },
  track: { width: 38, height: 22, borderRadius: 11 },
  thumb: { width: 18, height: 18, borderRadius: 9, marginTop: 2, marginLeft: 2 },
  thumbOn: { marginLeft: 18 },
  bulletsLabel: { ...text.overline, marginTop: space.sm },
  bullet: { ...text.caption, marginTop: 2 },
  helps: { ...text.caption, fontStyle: 'italic', marginTop: space.xs },
  lockedLabel: { ...text.micro, marginTop: space.xs },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { SectionHeader } from '@/components/layout';
import { useT } from '@/i18n';
import { useMarketStore } from '@/stores/marketStore';
import { useAffiliatorsStore } from '@/stores/affiliatorsStore';
import { useEffect } from 'react';

export interface DirectorySectionProps {
  existingPeerIds: Set<string>;
  onStart: (peerId: string) => void;
}

function DirectoryRow({ name, subtitle, onPress }: { id: string; name: string; subtitle: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={[styles.row, { borderColor: colors.hairline }]}
    >
      <View style={[styles.avatar, { backgroundColor: colors.tintLeaf }]}>
        <Text style={[styles.initials, { color: colors.pine }]}>{name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>{name}</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]} numberOfLines={1}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

export function DirectorySection({ existingPeerIds, onStart }: DirectorySectionProps) {
  const t = useT();
  const directory = useMarketStore((s) => s.directory);
  const fetchDirectory = useMarketStore((s) => s.fetchDirectory);
  const affiliators = useAffiliatorsStore((s) => s.affiliators);
  const fetchAffiliators = useAffiliatorsStore((s) => s.fetch);

  useEffect(() => {
    void fetchDirectory();
    void fetchAffiliators();
  }, [fetchDirectory, fetchAffiliators]);

  const availableAffiliators = affiliators.filter((a) => !existingPeerIds.has(a.id));
  const availableRestaurants = directory.filter((r) => !existingPeerIds.has(r.id));

  if (availableAffiliators.length === 0 && availableRestaurants.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title={t('msg_directoryTitle')} />
      {availableAffiliators.length > 0 ? (
        <>
          <Text style={styles.groupLabel}>{t('msg_directoryAffiliators')}</Text>
          {availableAffiliators.map((affiliator) => (
            <DirectoryRow
              key={affiliator.id}
              id={affiliator.id}
              name={affiliator.name}
              subtitle={affiliator.role}
              onPress={() => onStart(affiliator.id)}
            />
          ))}
        </>
      ) : null}
      {availableRestaurants.length > 0 ? (
        <>
          <Text style={styles.groupLabel}>{t('msg_directoryRestaurants')}</Text>
          {availableRestaurants.map((restaurant) => (
            <DirectoryRow
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              subtitle={restaurant.neighborhood}
              onPress={() => onStart(restaurant.id)}
            />
          ))}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: space.sm },
  groupLabel: { ...text.overline, marginTop: space.md, marginBottom: space.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: hit.min,
    paddingVertical: space.xs,
    borderBottomWidth: 1,
  },
  avatar: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  initials: { ...text.label },
  textCol: { flex: 1 },
  name: { ...text.bodySemi },
  subtitle: { ...text.caption, marginTop: 2 },
});

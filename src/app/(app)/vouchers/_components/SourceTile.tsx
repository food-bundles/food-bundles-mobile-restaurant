import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { CheckIcon } from '@/components/icons';
import { formatRwf } from '@/lib';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

export interface SourceTileProps {
  icon: React.ReactNode;
  name: string;
  descriptionKey: TranslationKey;
  contributionRwf: number;
  selected: boolean;
  onToggle: () => void;
}

const MIN_TILE_HEIGHT = 140;

/** One 2-column consent grid tile: logo, name, contribution badge, description, and a selected checkmark overlay. */
export function SourceTile({ icon, name, descriptionKey, contributionRwf, selected, onToggle }: SourceTileProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={name}
      style={[
        styles.tile,
        { backgroundColor: colors.paper, borderColor: colors.hairline },
        selected && { borderColor: colors.leaf, borderWidth: 2, backgroundColor: colors.tintLeaf },
      ]}
    >
      {selected ? (
        <View style={[styles.checkOverlay, { backgroundColor: colors.leaf }]}>
          <CheckIcon size={12} color={colors.paper} />
        </View>
      ) : null}
      <View style={[styles.logoWrap, { backgroundColor: colors.tintLeaf }]}>{icon}</View>
      <Text style={[styles.name, { color: colors.ink }]}>{name}</Text>
      <View style={[styles.contributionBadge, { backgroundColor: colors.ripe }]}>
        <Text style={[styles.contributionLabel, { color: colors.paper }]}>+{formatRwf(contributionRwf)}</Text>
      </View>
      <Text style={[styles.description, { color: colors.secondary }]} numberOfLines={2}>
        {t(descriptionKey)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: MIN_TILE_HEIGHT,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space.sm,
    position: 'relative',
  },
  checkOverlay: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  name: { ...text.bodySemi, marginTop: space.sm },
  contributionBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    marginTop: space.xs,
  },
  contributionLabel: { ...text.micro, fontVariant: ['tabular-nums'] },
  description: { ...text.caption, marginTop: space.xs },
});

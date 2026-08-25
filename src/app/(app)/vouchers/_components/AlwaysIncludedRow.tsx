import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import { LogoMark } from '@/components/icons';
import { useT } from '@/i18n';

export interface AlwaysIncludedRowProps {
  name: string;
}

/** Non-interactive row showing FoodBundles as always-included in the consent grid, above the toggleable tiles. */
export function AlwaysIncludedRow({ name }: AlwaysIncludedRowProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
      <View style={[styles.logoWrap, { backgroundColor: colors.tintLeaf }]}>
        <LogoMark size={24} />
      </View>
      <Text style={[styles.name, { color: colors.ink }]}>{name}</Text>
      <View style={[styles.chip, { backgroundColor: colors.tintLeaf }]}>
        <Text style={[styles.chipLabel, { color: colors.tintedGreenText }]}>{t('consent_alwaysIncluded')}</Text>
      </View>
      <Text style={[styles.includedText, { color: colors.secondary }]}>{t('consent_included')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space.md,
    marginBottom: space.md,
  },
  logoWrap: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  name: { ...text.bodySemi, flex: 1 },
  chip: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 2 },
  chipLabel: { ...text.micro },
  includedText: { ...text.caption },
});

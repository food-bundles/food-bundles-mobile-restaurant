import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import type { Substitution } from '@/api/market.api';
import { useT } from '@/i18n';

export interface SubstituteCardProps {
  substitution: Substitution;
  onSwapInMenu: () => void;
}

/** One "smart substitute" pair: FROM → TO names, a savings note, and a swap-in-menu action. */
export function SubstituteCard({ substitution, onSwapInMenu }: SubstituteCardProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <View style={styles.nameRow}>
        <Text style={[styles.fromName, { color: colors.secondary }]}>{substitution.fromProductId}</Text>
        <Text style={[styles.arrow, { color: colors.secondary }]}>→</Text>
        <Text style={[styles.toName, { color: colors.ink }]}>{substitution.toProductId}</Text>
      </View>
      <Text style={[styles.note, { color: colors.leaf }]}>{substitution.note}</Text>
      <Pressable
        onPress={onSwapInMenu}
        accessibilityRole="button"
        accessibilityLabel={t('advisor_swapInMenu')}
        style={[styles.swapButton, { backgroundColor: colors.marigold }]}
      >
        <Text style={[styles.swapLabel, { color: colors.pine }]}>{t('advisor_swapInMenu')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 220, borderRadius: radius.lg, padding: space.md, marginRight: space.sm, ...shadow.card },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  arrow: { ...text.body },
  fromName: { ...text.caption, textDecorationLine: 'line-through' },
  toName: { ...text.bodySemi },
  note: { ...text.caption, marginTop: space.xs },
  swapButton: { minHeight: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', marginTop: space.sm },
  swapLabel: { ...text.label },
});

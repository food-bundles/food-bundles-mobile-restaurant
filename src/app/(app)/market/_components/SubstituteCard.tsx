import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, shadow, space, text, useTheme } from '@/theme';
import { products } from '@/mocks';
import type { Substitution } from '@/mocks';
import { useT } from '@/i18n';

export interface SubstituteCardProps {
  substitution: Substitution;
  onSwapInMenu: () => void;
}

const PHOTO_SIZE = 56;

/** One "smart substitute" pair: FROM photo → TO photo, a savings line, and a swap-in-menu action. */
export function SubstituteCard({ substitution, onSwapInMenu }: SubstituteCardProps) {
  const t = useT();
  const { colors } = useTheme();
  const from = products.find((p) => p.id === substitution.fromProductId);
  const to = products.find((p) => p.id === substitution.toProductId);
  if (!from || !to) return null;

  return (
    <View style={[styles.card, { backgroundColor: colors.paper }]}>
      <View style={styles.photoRow}>
        <Image source={from.image} style={styles.photo} accessibilityLabel={from.name} resizeMode="cover" />
        <Text style={[styles.arrow, { color: colors.secondary }]}>→</Text>
        <Image source={to.image} style={styles.photo} accessibilityLabel={to.name} resizeMode="cover" />
      </View>
      <Text style={[styles.fromName, { color: colors.secondary }]}>{from.name}</Text>
      <Text style={[styles.toName, { color: colors.ink }]}>{to.name}</Text>
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
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  photo: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 },
  arrow: { ...text.body },
  fromName: { ...text.caption, textDecorationLine: 'line-through', marginTop: space.sm },
  toName: { ...text.bodySemi },
  note: { ...text.caption, marginTop: space.xs },
  swapButton: {
    minHeight: hit.min,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  swapLabel: { ...text.label },
});

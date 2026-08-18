import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, space, text, useTheme } from '@/theme';
import { LogoMark } from '@/components/icons';
import { useT } from '@/i18n';
import { account } from '@/mocks';

export interface OrderingAsBannerProps {
  onExit: () => void;
}

export function OrderingAsBanner({ onExit }: OrderingAsBannerProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: colors.pine }]}>
      <LogoMark size={22} />
      <Text style={[styles.label, { color: colors.paper }]}>{t('aff_orderingAs', { business: account.businessName })}</Text>
      <Pressable
        onPress={onExit}
        accessibilityRole="button"
        accessibilityLabel={t('aff_exitSessionLabel')}
        style={styles.exitButton}
      >
        <Text style={[styles.exitLabel, { color: colors.marigold }]}>{t('aff_exitPreview')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  label: { ...text.label, flex: 1 },
  exitButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center' },
  exitLabel: { ...text.label },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, space, text } from '@/theme';
import { LogoMark } from '@/components/icons';
import { useT } from '@/i18n';
import { account } from '@/mocks';

export interface OrderingAsBannerProps {
  onExit: () => void;
}

export function OrderingAsBanner({ onExit }: OrderingAsBannerProps) {
  const t = useT();

  return (
    <View style={styles.banner}>
      <LogoMark size={22} />
      <Text style={styles.label}>{t('aff_orderingAs', { business: account.businessName })}</Text>
      <Pressable
        onPress={onExit}
        accessibilityRole="button"
        accessibilityLabel={t('aff_exitSessionLabel')}
        style={styles.exitButton}
      >
        <Text style={styles.exitLabel}>{t('aff_exitPreview')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: color.pine,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  label: { ...text.label, color: color.paper, flex: 1 },
  exitButton: { minHeight: hit.min, alignItems: 'center', justifyContent: 'center' },
  exitLabel: { ...text.label, color: color.marigold },
});

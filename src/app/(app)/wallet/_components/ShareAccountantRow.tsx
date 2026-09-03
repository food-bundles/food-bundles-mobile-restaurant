import { Pressable, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface ShareAccountantRowProps {
  onShare: () => void;
  onAskAccountant: () => void;
}

export function ShareAccountantRow({ onShare, onAskAccountant }: ShareAccountantRowProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_shareTopUpLink')}
        style={[styles.action, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
      >
        <Text style={[styles.label, { color: colors.leaf }]}>{t('wallet_shareLink')}</Text>
      </Pressable>
      <Pressable
        onPress={onAskAccountant}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_askAccountantTopUp')}
        style={[styles.action, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
      >
        <Text style={[styles.label, { color: colors.leaf }]}>{t('wallet_askAccountant')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  action: {
    flex: 1,
    minHeight: hit.min,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label },
});

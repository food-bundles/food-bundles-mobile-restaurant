import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export interface ShareAccountantRowProps {
  onShare: () => void;
  onAskAccountant: () => void;
}

export function ShareAccountantRow({ onShare, onAskAccountant }: ShareAccountantRowProps) {
  const t = useT();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_shareTopUpLink')}
        style={styles.action}
      >
        <Text style={styles.label}>{t('wallet_shareLink')}</Text>
      </Pressable>
      <Pressable
        onPress={onAskAccountant}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_askAccountantTopUp')}
        style={styles.action}
      >
        <Text style={styles.label}>{t('wallet_askAccountant')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  action: {
    flex: 1,
    minHeight: hit.min,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.hairline,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...text.label, color: color.leaf },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { useT } from '@/i18n';

export interface OrderActionsRowProps {
  ebmAvailable: boolean;
}

export function OrderActionsRow({ ebmAvailable }: OrderActionsRowProps) {
  const t = useT();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.push('/(app)/settings/ebm')}
        disabled={!ebmAvailable}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_previewEbm')}
        style={[
          styles.action,
          { backgroundColor: colors.paper, borderColor: colors.hairline },
          !ebmAvailable && styles.actionDisabled,
        ]}
      >
        <Text style={[styles.actionLabel, { color: colors.leaf }]}>{t('orders_downloadEbm')}</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/(app)/wallet/transactions')}
        accessibilityRole="button"
        accessibilityLabel={t('a11y_paymentHistory')}
        style={[styles.action, { backgroundColor: colors.paper, borderColor: colors.hairline }]}
      >
        <Text style={[styles.actionLabel, { color: colors.leaf }]}>{t('orders_paymentHistory')}</Text>
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
  actionDisabled: { opacity: 0.5 },
  actionLabel: { ...text.label },
});

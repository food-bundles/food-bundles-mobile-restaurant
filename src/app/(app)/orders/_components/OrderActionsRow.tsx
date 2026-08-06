import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { color, hit, radius, space, text } from '@/theme';
import { useT } from '@/i18n';

export interface OrderActionsRowProps {
  ebmAvailable: boolean;
}

export function OrderActionsRow({ ebmAvailable }: OrderActionsRowProps) {
  const t = useT();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.push('/(app)/settings/ebm')}
        disabled={!ebmAvailable}
        accessibilityRole="button"
        accessibilityLabel="Preview EBM invoice"
        style={[styles.action, !ebmAvailable && styles.actionDisabled]}
      >
        <Text style={styles.actionLabel}>{t('orders_downloadEbm')}</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/(app)/wallet/transactions')}
        accessibilityRole="button"
        accessibilityLabel="View payment history for this order"
        style={styles.action}
      >
        <Text style={styles.actionLabel}>{t('orders_paymentHistory')}</Text>
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
  actionDisabled: { opacity: 0.5 },
  actionLabel: { ...text.label, color: color.leaf },
});

import { StyleSheet, Text, View } from 'react-native';
import { color, space, text } from '@/theme';
import { ORDER_STEPS } from '@/mocks/types';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const STEP_KEY: Record<(typeof ORDER_STEPS)[number], TranslationKey> = {
  PENDING: 'st_pending',
  CONFIRMED: 'st_confirmed',
  PREPARING: 'st_preparing',
  READY: 'st_ready',
  IN_TRANSIT: 'st_intransit',
  DELIVERED: 'st_delivered',
};

export interface OrderProgressTrackProps {
  step: number;
}

export function OrderProgressTrack({ step }: OrderProgressTrackProps) {
  const t = useT();
  const isDelivered = step >= ORDER_STEPS.length;
  const currentLabel = t(STEP_KEY[ORDER_STEPS[Math.min(step, ORDER_STEPS.length) - 1] ?? 'PENDING']);

  return (
    <View>
      <View style={styles.row}>
        {ORDER_STEPS.map((_, index) => {
          const segmentNumber = index + 1;
          const done = segmentNumber < step || isDelivered;
          const current = segmentNumber === step && !isDelivered;
          const backgroundColor = done ? color.leaf : current ? color.marigold : color.hairline;
          return <View key={segmentNumber} style={[styles.segment, { backgroundColor }]} />;
        })}
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.stepLabel}>
          Step {Math.min(step, ORDER_STEPS.length)} of {ORDER_STEPS.length}
        </Text>
        <Text style={[styles.currentLabel, isDelivered && styles.deliveredLabel]}>
          {isDelivered ? t('st_delivered') : currentLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  segment: { height: 6, flex: 1, borderRadius: 3 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.sm,
  },
  stepLabel: { ...text.caption, color: color.secondary },
  currentLabel: { ...text.label, color: color.tintedAmberText },
  deliveredLabel: { color: color.tintedGreenText },
});

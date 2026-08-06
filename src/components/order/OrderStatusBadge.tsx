import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, text } from '@/theme';
import type { OrderStatus } from '@/mocks/types';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const STATUS_KEY: Record<OrderStatus, TranslationKey> = {
  PENDING: 'st_pending',
  CONFIRMED: 'st_confirmed',
  PREPARING: 'st_preparing',
  READY: 'st_ready',
  IN_TRANSIT: 'st_intransit',
  DELIVERED: 'st_delivered',
  CANCELLED: 'st_cancelled',
  REFUNDED: 'st_refunded',
};

const STATUS_BG: Record<OrderStatus, string> = {
  PENDING: color.neutral,
  CONFIRMED: color.tintLeaf,
  PREPARING: color.tintLeaf,
  READY: color.tintLeaf,
  IN_TRANSIT: color.tintMarigold,
  DELIVERED: color.tintRipe,
  CANCELLED: color.tintChili,
  REFUNDED: color.neutral,
};

const STATUS_TEXT: Record<OrderStatus, string> = {
  PENDING: color.secondary,
  CONFIRMED: color.pine,
  PREPARING: color.pine,
  READY: color.pine,
  IN_TRANSIT: color.tintedAmberText,
  DELIVERED: color.tintedGreenText,
  CANCELLED: color.tintedRedText,
  REFUNDED: color.tintedRedText,
};

export interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const t = useT();

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: STATUS_BG[status] },
        status === 'REFUNDED' && styles.dashed,
      ]}
    >
      <Text style={[styles.label, { color: STATUS_TEXT[status] }]}>{t(STATUS_KEY[status])}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: space.md - 1,
    paddingVertical: space.xs + 1,
  },
  dashed: { borderWidth: 1, borderStyle: 'dashed', borderColor: color.refundedDashed },
  label: { ...text.overline },
});

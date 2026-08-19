import { StyleSheet, Text, View } from 'react-native';
import { radius, space, text, useTheme } from '@/theme';
import type { ColorPalette } from '@/theme';
import { formatDate, formatRwf } from '@/lib';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';
import type { Voucher, VoucherStatus } from '@/mocks/types';

export interface VoucherListItemProps {
  voucher: Voucher;
}

const STATUS_KEY: Record<VoucherStatus, TranslationKey> = {
  AVAILABLE: 'vouchers_statusAvailable',
  USED: 'vouchers_statusUsed',
  EXPIRED: 'vouchers_statusExpired',
};

const STATUS_BG = (colors: ColorPalette): Record<VoucherStatus, string> => ({
  AVAILABLE: colors.tintLeaf,
  USED: colors.neutral,
  EXPIRED: colors.tintChili,
});

const STATUS_TEXT = (colors: ColorPalette): Record<VoucherStatus, string> => ({
  AVAILABLE: colors.tintedGreenText,
  USED: colors.secondary,
  EXPIRED: colors.tintedRedText,
});

export function VoucherListItem({ voucher }: VoucherListItemProps) {
  const t = useT();
  const { colors } = useTheme();
  const isSpent = voucher.status !== 'AVAILABLE';

  return (
    <View style={[styles.row, { borderColor: colors.hairline }, isSpent && styles.rowSpent]}>
      <View style={styles.textCol}>
        <Text style={[styles.amount, { color: colors.ink }]}>{formatRwf(voucher.amount)}</Text>
        <Text style={[styles.code, { color: colors.secondary }]}>{voucher.code}</Text>
        <Text style={[styles.expiry, { color: colors.secondary }]}>
          {voucher.status === 'AVAILABLE'
            ? t('vouchers_expiresOn', { date: formatDate(voucher.expiresAt) })
            : t('vouchers_usedOn', { date: formatDate(voucher.usedAt ?? voucher.expiresAt) })}
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: STATUS_BG(colors)[voucher.status] }]}>
        <Text style={[styles.statusLabel, { color: STATUS_TEXT(colors)[voucher.status] }]}>
          {t(STATUS_KEY[voucher.status])}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.sm,
  },
  rowSpent: { opacity: 0.6 },
  textCol: { gap: 2 },
  amount: { ...text.bodySemi },
  code: { ...text.caption, fontVariant: ['tabular-nums'] },
  expiry: { ...text.caption },
  statusBadge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 3 },
  statusLabel: { ...text.micro },
});

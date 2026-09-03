import { useNotificationsStore, useVouchersStore } from '@/stores';
import { scheduleDelayedNotification } from '@/services/notificationService';
import { translate } from '@/i18n';
import { formatDate } from '@/lib';

const REMINDER_WINDOW_DAYS = 3;
const IMMEDIATE_DELAY_SECONDS = 5;

function alreadyReminded(voucherCode: string): boolean {
  return useNotificationsStore
    .getState()
    .notifications.some((n) => n.channel === 'voucher' && n.deepLink?.includes('vouchers') && n.body.includes(voucherCode));
}

/**
 * Checks every available voucher on app mount and fires a "voucher expiring soon" reminder
 * for any that fall inside the 3-day window and haven't already been reminded about. Mirrors
 * "scheduled at issuance time" for a mocked app with no real issuance event to hook into.
 */
export async function checkVoucherExpiryReminders(): Promise<void> {
  const vouchers = useVouchersStore.getState().vouchers;
  const now = Date.now();
  const windowMs = REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const expiringSoon = vouchers.filter((voucher) => {
    if (voucher.status !== 'AVAILABLE') return false;
    const expiresAt = new Date(voucher.expiresAt).getTime();
    return expiresAt > now && expiresAt - now <= windowMs && !alreadyReminded(voucher.code);
  });

  for (const voucher of expiringSoon) {
    await scheduleDelayedNotification(
      {
        channel: 'voucher',
        title: translate('notif_voucherExpiringSoon', { date: formatDate(voucher.expiresAt) }),
        body: translate('notif_voucherExpiringSoonBody', { code: voucher.code }),
        deepLink: '/(app)/(tabs)/wallet?tab=vouchers',
      },
      IMMEDIATE_DELAY_SECONDS,
    );
  }
}

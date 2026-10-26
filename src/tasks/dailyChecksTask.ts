import { useNotificationsStore, useVouchersStore } from '@/stores';
import { useMarketStore } from '@/stores/marketStore';
import { scheduleDelayedNotification } from '@/services/notificationService';
import { translate } from '@/i18n';
import { formatDate, formatRwf } from '@/lib';
import { getVouchersApi } from '@/api/vouchers.api';

const CONSENT_REMINDER_WINDOW_DAYS = 3;
const REPAYMENT_REMINDER_DAYS = 5;
const DAILY_DIGEST_HOUR = 7;

function secondsUntilNextHour(hour: number): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, 0, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  return Math.round((next.getTime() - now.getTime()) / 1000);
}

function alreadyNotified(channel: 'marketPrice' | 'consent' | 'repayment', matchKey: string): boolean {
  return useNotificationsStore
    .getState()
    .notifications.some((n) => n.channel === channel && n.body.includes(matchKey));
}

/** Schedules the next 07:00 market-price digest using real market store data. */
export async function scheduleDailyMarketDigest(): Promise<void> {
  const dashboard = useMarketStore.getState().dashboard;
  if (!dashboard) return;

  const sorted = [...dashboard.commodities].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
  const drop = sorted.find((c) => c.changePct < -2);
  const rise = sorted.find((c) => c.changePct > 2);
  if (!drop && !rise) return;

  const dropText = drop ? `${drop.name} ${drop.changePct.toFixed(1)}%` : '';
  const riseText = rise ? `${rise.name} +${rise.changePct.toFixed(1)}%` : '';
  const summary = [dropText, riseText].filter(Boolean).join(' · ');

  const today = formatDate(new Date().toISOString());
  if (alreadyNotified('marketPrice', today)) return;

  await scheduleDelayedNotification(
    {
      channel: 'marketPrice',
      title: translate('notif_marketUpdate', { summary }),
      body: `${summary} (${today})`,
      deepLink: '/(app)/market/market-prices',
    },
    secondsUntilNextHour(DAILY_DIGEST_HOUR),
  );
}

/** Reminds the restaurant 3 days before any granted data-consent source expires. */
export async function checkConsentExpiryReminders(): Promise<void> {
  const consentList = useVouchersStore.getState().consentList;
  const now = Date.now();
  const windowMs = CONSENT_REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  for (const consent of consentList) {
    if (!consent.granted || !consent.expiresAt) continue;
    const expiresAt = new Date(consent.expiresAt).getTime();
    if (expiresAt <= now || expiresAt - now > windowMs) continue;
    if (alreadyNotified('consent', consent.source)) continue;

    await scheduleDelayedNotification(
      {
        channel: 'consent',
        title: translate('notif_consentExpiring', { source: consent.source }),
        body: translate('notif_consentExpiringBody', { source: consent.source }),
        deepLink: '/(app)/vouchers/consent',
      },
      5,
    );
  }
}

/**
 * Fetches real voucher data from the backend and reminds the restaurant
 * REPAYMENT_REMINDER_DAYS before any active voucher's expiry date.
 */
export async function checkRepaymentReminder(): Promise<void> {
  let vouchers;
  try {
    vouchers = await getVouchersApi();
  } catch {
    return;
  }

  const now = Date.now();
  const windowMs = REPAYMENT_REMINDER_DAYS * 24 * 60 * 60 * 1000;

  for (const voucher of vouchers) {
    if (voucher.status !== 'AVAILABLE') continue;
    const dueAt = new Date(voucher.expiresAt).getTime();
    const msUntilDue = dueAt - now;
    if (msUntilDue < 0 || msUntilDue > windowMs) continue;
    if (alreadyNotified('repayment', voucher.expiresAt)) continue;

    await scheduleDelayedNotification(
      {
        channel: 'repayment',
        title: translate('notif_repaymentDueSoon', {
          days: REPAYMENT_REMINDER_DAYS,
          amount: formatRwf(voucher.amount),
        }),
        body: translate('notif_repaymentDueSoonBody', { date: formatDate(voucher.expiresAt) }),
        deepLink: '/(app)/(tabs)/wallet?tab=vouchers',
      },
      5,
    );
  }
}

import { useNotificationsStore, useVouchersStore } from '@/stores';
import { scheduleDelayedNotification } from '@/services/notificationService';
import { translate } from '@/i18n';
import { computeBuyingAdvice } from '@/lib';
import { formatDate } from '@/lib';

const CONSENT_REMINDER_WINDOW_DAYS = 3;
const REPAYMENT_REMINDER_DAYS = 5;
const MOCK_REPAYMENT_DUE_DATE = '2026-08-30';
const MOCK_REPAYMENT_AMOUNT_RWF = 59_200;
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

/** Schedules the next 07:00 market-price digest, highlighting today's biggest mover in each direction. */
export async function scheduleDailyMarketDigest(): Promise<void> {
  const { buyNow, wait } = computeBuyingAdvice();
  const drop = buyNow[0];
  const rise = wait[0];
  if (!drop && !rise) return;

  const dropText = drop ? `${drop.name} ${Math.round(drop.changeFraction * 100)}%` : '';
  const riseText = rise ? `${rise.name} +${Math.round(rise.changeFraction * 100)}%` : '';
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

/** Reminds the restaurant 5 days before a mock voucher-repayment settlement date. */
export async function checkRepaymentReminder(): Promise<void> {
  const now = Date.now();
  const dueAt = new Date(MOCK_REPAYMENT_DUE_DATE).getTime();
  const daysUntilDue = Math.round((dueAt - now) / (24 * 60 * 60 * 1000));
  if (daysUntilDue !== REPAYMENT_REMINDER_DAYS) return;
  if (alreadyNotified('repayment', MOCK_REPAYMENT_DUE_DATE)) return;

  await scheduleDelayedNotification(
    {
      channel: 'repayment',
      title: translate('notif_repaymentDueSoon', {
        days: REPAYMENT_REMINDER_DAYS,
        amount: MOCK_REPAYMENT_AMOUNT_RWF.toLocaleString('en-US'),
      }),
      body: translate('notif_repaymentDueSoonBody', { date: formatDate(MOCK_REPAYMENT_DUE_DATE) }),
      deepLink: '/(app)/(tabs)/wallet?tab=vouchers',
    },
    5,
  );
}

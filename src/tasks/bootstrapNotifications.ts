import { requestPermissions } from '@/services/notificationService';
import { checkVoucherExpiryReminders } from './voucherExpiryTask';
import { scheduleDailyMarketDigest, checkConsentExpiryReminders, checkRepaymentReminder } from './dailyChecksTask';
import { scheduleWelcomeNotificationOnce } from './welcomeNotificationTask';

/** Runs every mount-time notification check once, in sequence, after permission is granted. */
export async function bootstrapNotifications(): Promise<void> {
  await requestPermissions();
  await scheduleWelcomeNotificationOnce();
  await checkVoucherExpiryReminders();
  await checkConsentExpiryReminders();
  await checkRepaymentReminder();
  await scheduleDailyMarketDigest();
}

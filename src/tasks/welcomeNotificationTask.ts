import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleLocalNotification } from '@/services/notificationService';
import { translate } from '@/i18n';

const FIRST_OPEN_FLAG_KEY = 'fb_welcome_notification_sent';

/** Fires the one-time welcome notification on the first app open after install. */
export async function scheduleWelcomeNotificationOnce(): Promise<void> {
  const alreadySent = await AsyncStorage.getItem(FIRST_OPEN_FLAG_KEY);
  if (alreadySent) return;

  await scheduleLocalNotification({
    channel: 'system',
    title: translate('notif_welcomeTitle'),
    body: translate('notif_welcomeBody'),
  });
  await AsyncStorage.setItem(FIRST_OPEN_FLAG_KEY, '1');
}

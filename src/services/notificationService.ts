import * as Notifications from 'expo-notifications';
import { useNotificationsStore } from '@/stores';
import type { AppNotification, NotificationChannel } from '@/mocks/types';

type NotificationDraft = Omit<AppNotification, 'id' | 'read' | 'timestamp'>;

/** Requests OS notification permission once; call on app mount. Returns true if granted. */
export async function requestPermissions(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

function generateNotificationId(): string {
  return `NOTIF-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

/**
 * Schedules an immediate local notification and appends it to the notification store.
 * Skips the native push (but still records it in-store) when the channel is disabled
 * in the user's notification settings.
 */
export async function scheduleLocalNotification(payload: NotificationDraft): Promise<string> {
  const id = generateNotificationId();
  const timestamp = new Date().toISOString();
  const channelEnabled = useNotificationsStore.getState().channelPrefs[payload.channel];

  if (channelEnabled) {
    await Notifications.scheduleNotificationAsync({
      content: { title: payload.title, body: payload.body },
      trigger: null,
    });
  }

  useNotificationsStore.getState().addNotification({ ...payload, id, timestamp, read: false });
  return id;
}

/** Same as `scheduleLocalNotification`, but the native push fires after `delaySeconds`. */
export async function scheduleDelayedNotification(payload: NotificationDraft, delaySeconds: number): Promise<string> {
  const id = generateNotificationId();
  const timestamp = new Date().toISOString();
  const channelEnabled = useNotificationsStore.getState().channelPrefs[payload.channel];

  if (channelEnabled) {
    await Notifications.scheduleNotificationAsync({
      content: { title: payload.title, body: payload.body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySeconds },
    });
  }

  useNotificationsStore.getState().addNotification({ ...payload, id, timestamp, read: false });
  return id;
}

/** Cancels a previously scheduled native notification by its identifier. */
export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

/** Records a custom price-threshold alert; the mock poller checks it against market prices. */
export function setPriceAlert(productId: string, thresholdRwf: number, direction: 'above' | 'below'): void {
  useNotificationsStore.getState().setPriceAlert(productId, thresholdRwf, direction);
}

export type { NotificationChannel, AppNotification };

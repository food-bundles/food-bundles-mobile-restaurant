/**
 * Mock background order-status checker. Registered on app mount via `registerOrderStatusTask()`.
 *
 * Requires these app.json additions (already applied):
 * - plugins: "expo-task-manager", "expo-notifications", "expo-background-task"
 * - iOS: expo-background-task's config plugin adds the `processing` UIBackgroundMode automatically.
 * - Android: no extra permissions needed for expo-background-task beyond what its plugin sets.
 */
import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import { useOrdersStore } from '@/stores/ordersStore';
import { translate } from '@/i18n';

export const ORDER_STATUS_TASK = 'BACKGROUND_ORDER_STATUS_CHECK';

const STATUS_KEY = {
  PENDING: 'st_pending',
  CONFIRMED: 'st_confirmed',
  PREPARING: 'st_preparing',
  READY: 'st_ready',
  IN_TRANSIT: 'st_intransit',
  DELIVERED: 'st_delivered',
} as const;

const ADVANCE_PROBABILITY = 0.2;

TaskManager.defineTask(ORDER_STATUS_TASK, async () => {
  try {
    const orders = useOrdersStore.getState().orders;
    const activeOrder = orders.find((order) => order.status === 'IN_TRANSIT') ?? orders[0];
    if (!activeOrder || Math.random() >= ADVANCE_PROBABILITY) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const advance = useOrdersStore.getState().advanceOrderStatus(activeOrder.id);
    if (!advance) return BackgroundTask.BackgroundTaskResult.Success;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: translate('orders_statusNotifTitle', { orderId: advance.orderId }),
        body: translate('orders_statusNotifBody', {
          status: translate(STATUS_KEY[advance.newStatus]),
        }),
      },
      trigger: null,
    });

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

/** Registers the task once; safe to call on every app mount. */
export async function registerOrderStatusTask(): Promise<void> {
  const alreadyRegistered = await TaskManager.isTaskRegisteredAsync(ORDER_STATUS_TASK);
  if (alreadyRegistered) return;
  await BackgroundTask.registerTaskAsync(ORDER_STATUS_TASK, { minimumInterval: 15 });
}

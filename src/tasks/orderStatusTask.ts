import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { useOrdersStore } from '@/stores/ordersStore';
import { scheduleLocalNotification } from '@/services/notificationService';
import { translate } from '@/i18n';
import { getOrderByIdApi } from '@/api/orders.api';

export const ORDER_STATUS_TASK = 'BACKGROUND_ORDER_STATUS_CHECK';

const STATUS_KEY = {
  PENDING: 'st_pending',
  CONFIRMED: 'st_confirmed',
  PREPARING: 'st_preparing',
  READY: 'st_ready',
  IN_TRANSIT: 'st_intransit',
  DELIVERED: 'st_delivered',
} as const;

TaskManager.defineTask(ORDER_STATUS_TASK, async () => {
  try {
    const orders = useOrdersStore.getState().orders;
    // Only poll orders that are actively in progress
    const activeOrders = orders.filter((o) => o.step > 0 && o.step < 6);
    if (activeOrders.length === 0) return BackgroundTask.BackgroundTaskResult.Success;

    for (const order of activeOrders) {
      try {
        const fresh = await getOrderByIdApi(order.id);
        if (fresh.status !== order.status) {
          // Update store with real status
          useOrdersStore.setState((state) => ({
            orders: state.orders.map((o) =>
              o.id === order.id ? { ...o, status: fresh.status, step: fresh.step } : o,
            ),
          }));

          const statusKey = STATUS_KEY[fresh.status as keyof typeof STATUS_KEY];
          if (statusKey) {
            await scheduleLocalNotification({
              channel: 'order',
              title: translate('notif_orderStatusChanged', {
                orderId: order.id,
                status: translate(statusKey),
              }),
              body: translate('orders_statusNotifBody', { status: translate(statusKey) }),
              deepLink: `/(app)/orders/${order.id}`,
              actionLabel: translate('notif_viewOrderAction'),
            });
          }
        }
      } catch {
        // Non-fatal: skip this order on network error
      }
    }

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

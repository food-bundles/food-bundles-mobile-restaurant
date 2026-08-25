import type { AppNotification } from '@/mocks/types';

export type NotificationGroupKey = 'today' | 'yesterday' | 'earlierThisWeek' | 'older';

export interface NotificationGroup {
  key: NotificationGroupKey;
  items: AppNotification[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Buckets notifications into Today / Yesterday / Earlier this week / Older, newest-first within each. */
export function groupNotificationsByDay(notifications: AppNotification[], now: number = Date.now()): NotificationGroup[] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const yesterdayStart = todayStart - DAY_MS;
  const weekStart = todayStart - 7 * DAY_MS;

  const buckets: Record<NotificationGroupKey, AppNotification[]> = {
    today: [],
    yesterday: [],
    earlierThisWeek: [],
    older: [],
  };

  for (const notification of notifications) {
    const time = new Date(notification.timestamp).getTime();
    if (time >= todayStart) buckets.today.push(notification);
    else if (time >= yesterdayStart) buckets.yesterday.push(notification);
    else if (time >= weekStart) buckets.earlierThisWeek.push(notification);
    else buckets.older.push(notification);
  }

  return (['today', 'yesterday', 'earlierThisWeek', 'older'] as const)
    .map((key) => ({ key, items: buckets[key] }))
    .filter((group) => group.items.length > 0);
}

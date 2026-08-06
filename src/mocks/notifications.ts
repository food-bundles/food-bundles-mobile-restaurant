import type { NotificationItem } from './types';

export const notifications: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    title: 'Order in transit',
    body: 'FB-24815 is on its way, arriving around 10:30.',
    date: '2026-08-05T09:48:00',
    read: false,
    orderId: 'FB-24815',
  },
  {
    id: 'NOTIF-2',
    title: 'Order delivered',
    body: 'FB-24790 was delivered. Download your EBM invoice.',
    date: '2026-08-01T12:20:00',
    read: true,
    orderId: 'FB-24790',
  },
  {
    id: 'NOTIF-3',
    title: 'Order preparing',
    body: 'FB-24762 is being prepared at Kinyinya farm.',
    date: '2026-07-28T14:20:00',
    read: true,
    orderId: 'FB-24762',
  },
  {
    id: 'NOTIF-4',
    title: 'Wallet topped up',
    body: 'Your wallet was topped up with 500,000 RWF.',
    date: '2026-08-04T09:01:00',
    read: true,
  },
];

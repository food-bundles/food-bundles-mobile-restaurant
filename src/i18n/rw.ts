import type { en } from './en';

export const rw: Record<keyof typeof en, string> = {
  tab_shop: 'Kugura',
  tab_orders: 'Ibyatumijwe',
  tab_wallet: 'Ikofi',
  tab_vouchers: 'Inguzanyo',
  tab_more: 'Ibindi',

  st_pending: 'Bitegereje',
  st_confirmed: 'Byemejwe',
  st_preparing: 'Birategurwa',
  st_ready: 'Biriteguye',
  st_intransit: 'Biri mu nzira',
  st_delivered: 'Byatanzwe',
  st_cancelled: 'Byahagaritswe',
  st_refunded: 'Byasubijwe',

  action_back: 'Subira inyuma',
  action_retry: 'Ongera ugerageze',
  action_continue: 'Komeza',
  action_cancel: 'Hagarika',
  action_save: 'Bika',
  action_close: 'Funga',

  common_loading: 'Birimo gutegurwa…',
};

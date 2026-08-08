import type { notifications as notificationsEn } from '../en/notifications';

export const notifications: Record<keyof typeof notificationsEn, string> = {
  notif_title: 'Amatangazo',
  notif_markAllRead: 'Shyiraho ko byose byasomwe',
  notif_emptyTitle: 'Nta matangazo urabona',
  notif_emptyMessage: 'Tuzagutangariza igihe hazaba hari ikintu gishya.',
  notif_readLabel: 'byasomwe',
  notif_unreadLabel: 'ntibirasomwa',
  notif_orderFeedTitle: 'Amakuru ya {{orderId}}',
  notif_outForDelivery: 'Biri mu nzira',
  notif_driverAssigned: 'Umushoferi yahawe · {{time}}',
  notif_readyAtDepot: 'Biriteguye ku bubiko',
  notif_packedChecked: 'Byapakiwe & Byasuzumwe · {{time}}',
  notif_preparingLabel: 'Birategurwa',
  notif_sortingProduce: 'Ibiribwa byawe biratunganywa · {{time}}',
  notif_confirmedLabel: 'Byemejwe',
  notif_depotAccepted: 'Ububiko bwemeye itumiza · {{time}}',
  notif_arrivingAround: 'izaza nko saa {{time}}',

  chat_title: 'Ubufasha bwa AI',
  chat_onlineNow: 'Turi kuri interineti',
  chat_typeMessage: 'Andika ubutumwa…',
  chat_send: 'Ohereza ubutumwa',
  chat_suggestion1: 'Itumiza ryanjye riri he?',
  chat_suggestion2: 'Inguzanyo zikora zite?',
  chat_suggestion3: 'Ongeramo ku ikofi',
};

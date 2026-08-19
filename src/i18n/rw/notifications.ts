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
  chat_attach: 'Ohereza ifoto',
  chat_removeImage: 'Kuraho ifoto',
  chat_suggestion1: 'Itumiza ryanjye riri he?',
  chat_suggestion2: 'Inguzanyo zikora zite?',
  chat_suggestion3: 'Ongeramo ku ikofi',
  chat_answerOrderStatus:
    'Itumiza FB-24815 riri mu nzira, rizagera nko saa 10:30. Ushobora gukurikirana buri ntambwe ku mbonerahamwe y’itumiza.',
  chat_answerVouchers:
    'Isanzwe n’Iy’Icyubahiro byombi bihabwa umutwe w’inguzanyo buri kwezi — buri nguzanyo yishyura itumiza rimwe. Buri bwishyu bw’inguzanyo bwemezwa na kode y’inshuro imwe.',
  chat_answerTopUp:
    'Fungura Ikofi → Ongeramo hanyuma uhitemo MTN MoMo, Airtel Money, cyangwa ikarita. Ushobora no gusangira ihuza ryo kongeramo n’umubare wawe w’ibaruramari.',
  chat_fallbackAnswer: 'Murakoze — umukozi wa FoodBundles azabasubiza vuba.',
};

import type { notifications as notificationsEn } from '../en/notifications';

export const notifications: Record<keyof typeof notificationsEn, string> = {
  notif_title: 'Notifications',
  notif_markAllRead: 'Tout marquer comme lu',
  notif_emptyTitle: 'Aucune notification pour le moment',
  notif_emptyMessage: 'Nous vous informerons dès qu’il y aura du nouveau.',
  notif_readLabel: 'lu',
  notif_unreadLabel: 'non lu',
  notif_orderFeedTitle: 'Mises à jour {{orderId}}',
  notif_outForDelivery: 'En cours de livraison',
  notif_driverAssigned: 'Chauffeur assigné · {{time}}',
  notif_readyAtDepot: 'Prêt au dépôt',
  notif_packedChecked: 'Emballé et vérifié · {{time}}',
  notif_preparingLabel: 'En préparation',
  notif_sortingProduce: 'Tri de vos produits · {{time}}',
  notif_confirmedLabel: 'Confirmée',
  notif_depotAccepted: 'Commande acceptée par le dépôt · {{time}}',
  notif_arrivingAround: 'arrivée vers {{time}}',

  chat_title: 'Assistance IA',
  chat_onlineNow: 'En ligne maintenant',
  chat_typeMessage: 'Écrivez un message…',
  chat_send: 'Envoyer le message',
  chat_attach: 'Joindre une photo',
  chat_removeImage: 'Retirer la photo',
  chat_suggestion1: 'Où est ma commande ?',
  chat_suggestion2: 'Comment fonctionnent les bons ?',
  chat_suggestion3: 'Recharger mon portefeuille',
  chat_answerOrderStatus:
    'La commande FB-24815 est en cours de livraison, arrivée prévue vers 10h30. Vous pouvez suivre chaque étape sur l’écran de la commande.',
  chat_answerVouchers:
    'Basique et Premium reçoivent tous deux un lot de bons chaque mois — chaque bon règle une commande. Chaque paiement par bon est confirmé par un code à usage unique.',
  chat_answerTopUp:
    'Ouvrez Portefeuille → Recharger et choisissez MTN MoMo, Airtel Money ou carte. Vous pouvez aussi partager un lien de recharge avec votre comptable.',
  chat_fallbackAnswer: 'Merci — un spécialiste FoodBundles vous répondra sous peu.',
};

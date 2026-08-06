import type { common as commonEn } from '../en/common';

export const common: Record<keyof typeof commonEn, string> = {
  tab_shop: 'Boutique',
  tab_orders: 'Commandes',
  tab_wallet: 'Portefeuille',
  tab_vouchers: 'Bons',
  tab_more: 'Plus',

  st_pending: 'En attente',
  st_confirmed: 'Confirmée',
  st_preparing: 'En préparation',
  st_ready: 'Prête',
  st_intransit: 'En transit',
  st_delivered: 'Livrée',
  st_cancelled: 'Annulée',
  st_refunded: 'Remboursée',

  action_back: 'Retour',
  action_retry: 'Réessayer',
  action_continue: 'Continuer',
  action_cancel: 'Annuler',
  action_save: 'Enregistrer',
  action_close: 'Fermer',

  common_loading: 'Chargement…',
};

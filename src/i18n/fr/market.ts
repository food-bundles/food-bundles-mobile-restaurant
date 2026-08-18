import type { market as marketEn } from '../en/market';

export const market: Record<keyof typeof marketEn, string> = {
  market_title: 'Prix du marché',
  market_subtitle: 'Marchés de produits de Kigali en direct',
  market_updatedAgo: 'Mis à jour il y a {{minutes}} min',
  a11y_refreshPrices: 'Actualiser les prix du marché',

  market_comparisonTitle: 'Comparaison des marchés',
  market_bestPrice: 'MEILLEUR PRIX',
  market_stockHigh: 'Stock élevé',
  market_stockMedium: 'Stock moyen',
  market_stockLow: 'Stock faible',
  market_expandMarket: 'Afficher le graphique sur 7 jours pour {{market}}',

  market_weeklyAvgTitle: 'Moyenne hebdo',
  market_vsLastWeek: '{{sign}}{{percent}} % vs la semaine dernière',
  market_bestTimeTitle: 'Meilleur moment pour acheter',
  market_cheapestDay: 'Moins cher le {{day}}',
  market_volatilityTitle: 'Volatilité',
  market_volatilityLow: 'Faible',
  market_volatilityMedium: 'Moyenne',
  market_volatilityHigh: 'Élevée',
  market_volatilityLowDesc: 'Les prix sont restés stables cette semaine.',
  market_volatilityMediumDesc: 'Les prix ont modérément varié cette semaine.',
  market_volatilityHighDesc: 'Les prix ont fortement varié cette semaine.',
  market_volumeTrendTitle: 'Tendance du volume',

  market_trackToggleTitle: 'Suivre ce marché',
  market_trackToggleSub: 'Vous serez averti quand {{commodity}} passera sous {{price}}',
  a11y_trackMarketToggle: 'Suivre ce marché pour des alertes de baisse de prix',
  market_upgradeTitle: 'Suivez les marchés avec Premium',
  market_upgradeSub: 'Soyez averti dès qu’un produit que vous suivez baisse de prix.',
  market_upgradeCta: 'Voir les offres Premium',
};

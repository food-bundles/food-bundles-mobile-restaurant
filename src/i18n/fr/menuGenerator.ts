import type { menuGenerator as menuGeneratorEn } from '../en/menuGenerator';

export const menuGenerator: Record<keyof typeof menuGeneratorEn, string> = {
  menu_generatorShortcut: 'Générer un menu',
  menu_step1Title: 'Parlez-nous de votre menu',
  menu_restaurantType: 'Type de restaurant',
  menu_mealTypesToInclude: 'Types de repas à inclure',
  menu_coversPerService: 'Couverts par service',
  menu_generateCta: 'Générer le menu',

  menu_cuisineAfrican: 'Africaine',
  menu_cuisineIndian: 'Indienne',
  menu_cuisineWestern: 'Occidentale',
  menu_cuisineAsian: 'Asiatique',
  menu_cuisineMediterranean: 'Méditerranéenne',
  menu_cuisineFusion: 'Fusion',
  menu_mealBreakfast: 'Petit-déjeuner',
  menu_mealLunch: 'Déjeuner',
  menu_mealDinner: 'Dîner',
  menu_mealAllDay: 'Toute la journée',

  menu_outputTitle: 'Menu recommandé pour {{restaurant}}',
  menu_outputSubtitle: "Basé sur les meilleurs prix du marché — {{date}}",
  menu_byMeal: 'Par repas',
  menu_byIngredient: 'Par ingrédient',
  menu_costPerPortion: '{{amount}} / portion',
  menu_bestSourcedFrom: 'Meilleure source : {{source}}',
  menu_addAllToCart: 'Ajouter tous les ingrédients au panier',
  menu_adjustQuantities: 'Ajuster les quantités',
  menu_orderAllFromFoodBundles: 'Tout commander sur FoodBundles',
  menu_exportPdf: 'Exporter le menu en PDF',
  menu_exportShareMessage: 'Le menu généré pour {{restaurant}}, prêt à commander sur FoodBundles.',
};

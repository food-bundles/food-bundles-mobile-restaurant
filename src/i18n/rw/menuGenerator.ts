import type { menuGenerator as menuGeneratorEn } from '../en/menuGenerator';

export const menuGenerator: Record<keyof typeof menuGeneratorEn, string> = {
  menu_generatorShortcut: 'Kora menu',
  menu_step1Title: 'Tubwire ibya menu yawe',
  menu_restaurantType: 'Ubwoko bwa resitora',
  menu_mealTypesToInclude: 'Ubwoko bw’ifunguro wifuza gushyiramo',
  menu_coversPerService: 'Abantu bagenerwa serivisi',
  menu_generateCta: 'Kora menu',

  menu_cuisineAfrican: 'Afurika',
  menu_cuisineIndian: 'Ubuhinde',
  menu_cuisineWestern: 'Uburengerazuba',
  menu_cuisineAsian: 'Aziya',
  menu_cuisineMediterranean: 'Mediterane',
  menu_cuisineFusion: 'Ivanze',
  menu_mealBreakfast: 'Igitondo',
  menu_mealLunch: 'Ku manywa',
  menu_mealDinner: 'Nimugoroba',
  menu_mealAllDay: 'Umunsi wose',

  menu_outputTitle: 'Menu yagenewe {{restaurant}}',
  menu_outputSubtitle: 'Ishingiye ku biciro byiza by’uyu munsi — {{date}}',
  menu_byMeal: 'Ku ifunguro',
  menu_byIngredient: 'Ku bikoresho',
  menu_costPerPortion: '{{amount}} / umuntu',
  menu_bestSourcedFrom: 'Aho biboneka neza: {{source}}',
  menu_addAllToCart: 'Ongeraho ibikoresho byose mu gikapu',
  menu_adjustQuantities: 'Hindura ingano',
  menu_orderAllFromFoodBundles: 'Byose tumiza kuri FoodBundles',
  menu_exportPdf: 'Kuramo menu ya PDF',
  menu_exportShareMessage: 'Menu ya {{restaurant}} yateguwe, iteguye gutumizwa kuri FoodBundles.',
};

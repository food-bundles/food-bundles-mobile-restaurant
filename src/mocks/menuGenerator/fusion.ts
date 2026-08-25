import type { MenuDish } from '../types';
import { FOODBUNDLES, KIMIRONKO } from './constants';

export const fusionDishes: MenuDish[] = [
  {
    id: 'fu-1',
    name: 'Avocado Fried Rice',
    cuisine: 'FUSION',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'rice', qty: 1 },
      { productId: 'avocados', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'fu-2',
    name: 'Spinach & Egg Wrap Style',
    cuisine: 'FUSION',
    mealTypes: ['BREAKFAST', 'LUNCH'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'spinach', qty: 1 },
      { productId: 'eggs', qty: 1 },
    ],
  },
  {
    id: 'fu-3',
    name: 'Curry Potato Salad',
    cuisine: 'FUSION',
    mealTypes: ['LUNCH', 'ALL_DAY'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'irish-potatoes', qty: 1 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'fu-4',
    name: 'Tomato & Cabbage Slaw',
    cuisine: 'FUSION',
    mealTypes: ['LUNCH'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'fresh-tomatoes', qty: 1 },
      { productId: 'cabbage', qty: 1 },
    ],
  },
  {
    id: 'fu-5',
    name: 'Banana Milk Oats',
    cuisine: 'FUSION',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'bananas', qty: 2 },
      { productId: 'fresh-milk', qty: 1 },
    ],
  },
  {
    id: 'fu-6',
    name: 'Carrot & Green Bean Medley',
    cuisine: 'FUSION',
    mealTypes: ['DINNER', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'carrots', qty: 1 },
      { productId: 'green-beans', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'fu-7',
    name: 'Onion & Rice Skillet',
    cuisine: 'FUSION',
    mealTypes: ['DINNER'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'red-onions', qty: 1 },
      { productId: 'rice', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'fu-8',
    name: 'Avocado & Tomato Toast Bowl',
    cuisine: 'FUSION',
    mealTypes: ['BREAKFAST', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'avocados', qty: 1 },
      { productId: 'fresh-tomatoes', qty: 1 },
    ],
  },
];

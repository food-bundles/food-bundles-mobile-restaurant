import type { MenuDish } from '../types';
import { FOODBUNDLES, KIMIRONKO } from './constants';

export const asianDishes: MenuDish[] = [
  {
    id: 'as-1',
    name: 'Vegetable Fried Rice',
    cuisine: 'ASIAN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'rice', qty: 1 },
      { productId: 'carrots', qty: 1 },
      { productId: 'green-beans', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'as-2',
    name: 'Cabbage Stir Fry',
    cuisine: 'ASIAN',
    mealTypes: ['LUNCH', 'ALL_DAY'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'cabbage', qty: 2 },
      { productId: 'carrots', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'as-3',
    name: 'Egg Fried Rice',
    cuisine: 'ASIAN',
    mealTypes: ['BREAKFAST', 'LUNCH'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'rice', qty: 1 },
      { productId: 'eggs', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'as-4',
    name: 'Spinach & Onion Noodle Style',
    cuisine: 'ASIAN',
    mealTypes: ['DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'spinach', qty: 2 },
      { productId: 'red-onions', qty: 1 },
    ],
  },
  {
    id: 'as-5',
    name: 'Tomato Soup with Greens',
    cuisine: 'ASIAN',
    mealTypes: ['DINNER', 'ALL_DAY'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'fresh-tomatoes', qty: 2 },
      { productId: 'spinach', qty: 1 },
    ],
  },
  {
    id: 'as-6',
    name: 'Bean & Carrot Salad',
    cuisine: 'ASIAN',
    mealTypes: ['LUNCH'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'green-beans', qty: 1 },
      { productId: 'carrots', qty: 1 },
    ],
  },
  {
    id: 'as-7',
    name: 'Potato & Onion Hash',
    cuisine: 'ASIAN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'irish-potatoes', qty: 1 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'as-8',
    name: 'Avocado Rice Bowl',
    cuisine: 'ASIAN',
    mealTypes: ['LUNCH', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'rice', qty: 1 },
      { productId: 'avocados', qty: 1 },
    ],
  },
];

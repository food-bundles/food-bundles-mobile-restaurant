import type { MenuDish } from '../types';
import { FOODBUNDLES, KIMIRONKO } from './constants';

export const mediterraneanDishes: MenuDish[] = [
  {
    id: 'me-1',
    name: 'Tomato & Onion Salad',
    cuisine: 'MEDITERRANEAN',
    mealTypes: ['LUNCH', 'ALL_DAY'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'fresh-tomatoes', qty: 2 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'me-2',
    name: 'Avocado & Egg Plate',
    cuisine: 'MEDITERRANEAN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'avocados', qty: 1 },
      { productId: 'eggs', qty: 1 },
    ],
  },
  {
    id: 'me-3',
    name: 'Braised Green Beans',
    cuisine: 'MEDITERRANEAN',
    mealTypes: ['DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'green-beans', qty: 2 },
      { productId: 'fresh-tomatoes', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'me-4',
    name: 'Potato & Carrot Bake',
    cuisine: 'MEDITERRANEAN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'irish-potatoes', qty: 1 },
      { productId: 'carrots', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'me-5',
    name: 'Cabbage & Tomato Braise',
    cuisine: 'MEDITERRANEAN',
    mealTypes: ['DINNER', 'ALL_DAY'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'cabbage', qty: 2 },
      { productId: 'fresh-tomatoes', qty: 1 },
    ],
  },
  {
    id: 'me-6',
    name: 'Milk & Banana Breakfast Bowl',
    cuisine: 'MEDITERRANEAN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'fresh-milk', qty: 1 },
      { productId: 'bananas', qty: 2 },
    ],
  },
  {
    id: 'me-7',
    name: 'Rice & Spinach Pilaf',
    cuisine: 'MEDITERRANEAN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'rice', qty: 1 },
      { productId: 'spinach', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'me-8',
    name: 'Onion & Egg Skillet',
    cuisine: 'MEDITERRANEAN',
    mealTypes: ['BREAKFAST', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'red-onions', qty: 1 },
      { productId: 'eggs', qty: 1 },
    ],
  },
];

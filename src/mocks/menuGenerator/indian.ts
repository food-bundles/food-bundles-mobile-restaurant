import type { MenuDish } from '../types';
import { FOODBUNDLES, KIMIRONKO } from './constants';

export const indianDishes: MenuDish[] = [
  {
    id: 'in-1',
    name: 'Aloo Gobi',
    cuisine: 'INDIAN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'irish-potatoes', qty: 1 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'in-2',
    name: 'Tomato & Onion Curry',
    cuisine: 'INDIAN',
    mealTypes: ['LUNCH', 'DINNER', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'fresh-tomatoes', qty: 2 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'in-3',
    name: 'Palak Paneer Style Spinach',
    cuisine: 'INDIAN',
    mealTypes: ['DINNER'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'spinach', qty: 2 },
      { productId: 'fresh-milk', qty: 1 },
    ],
  },
  {
    id: 'in-4',
    name: 'Egg Bhurji',
    cuisine: 'INDIAN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'eggs', qty: 1 },
      { productId: 'fresh-tomatoes', qty: 1 },
      { productId: 'red-onions', qty: 1 },
    ],
  },
  {
    id: 'in-5',
    name: 'Carrot & Bean Sabzi',
    cuisine: 'INDIAN',
    mealTypes: ['LUNCH', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'carrots', qty: 1 },
      { productId: 'green-beans', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'in-6',
    name: 'Cabbage Sabzi',
    cuisine: 'INDIAN',
    mealTypes: ['LUNCH'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'cabbage', qty: 2 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'in-7',
    name: 'Rice & Lentil Khichdi Style',
    cuisine: 'INDIAN',
    mealTypes: ['DINNER', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'rice', qty: 1 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'in-8',
    name: 'Fruit Lassi',
    cuisine: 'INDIAN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'bananas', qty: 1 },
      { productId: 'fresh-milk', qty: 1 },
    ],
  },
];

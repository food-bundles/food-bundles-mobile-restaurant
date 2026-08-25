import type { MenuDish } from '../types';
import { FOODBUNDLES, KIMIRONKO } from './constants';

export const westernDishes: MenuDish[] = [
  {
    id: 'we-1',
    name: 'Roast Potato & Carrot Plate',
    cuisine: 'WESTERN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'irish-potatoes', qty: 1 },
      { productId: 'carrots', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'we-2',
    name: 'Garden Salad',
    cuisine: 'WESTERN',
    mealTypes: ['LUNCH', 'ALL_DAY'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'fresh-tomatoes', qty: 1 },
      { productId: 'avocados', qty: 1 },
      { productId: 'cabbage', qty: 1 },
    ],
  },
  {
    id: 'we-3',
    name: 'Omelette & Greens',
    cuisine: 'WESTERN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'eggs', qty: 1 },
      { productId: 'spinach', qty: 1 },
    ],
  },
  {
    id: 'we-4',
    name: 'Green Bean & Onion Saute',
    cuisine: 'WESTERN',
    mealTypes: ['DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'green-beans', qty: 1 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'we-5',
    name: 'Banana Pancakes',
    cuisine: 'WESTERN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'bananas', qty: 2 },
      { productId: 'fresh-milk', qty: 1 },
      { productId: 'eggs', qty: 1 },
    ],
  },
  {
    id: 'we-6',
    name: 'Beef & Rice Bowl',
    cuisine: 'WESTERN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'rice', qty: 1 },
      { productId: 'carrots', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'we-7',
    name: 'Milk & Avocado Smoothie',
    cuisine: 'WESTERN',
    mealTypes: ['BREAKFAST', 'ALL_DAY'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'avocados', qty: 1 },
      { productId: 'fresh-milk', qty: 1 },
    ],
  },
  {
    id: 'we-8',
    name: 'Tomato & Onion Soup',
    cuisine: 'WESTERN',
    mealTypes: ['DINNER', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'fresh-tomatoes', qty: 2 },
      { productId: 'red-onions', qty: 1 },
    ],
  },
];

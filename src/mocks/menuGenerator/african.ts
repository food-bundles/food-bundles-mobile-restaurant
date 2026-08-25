import type { MenuDish } from '../types';
import { FOODBUNDLES, KIMIRONKO } from './constants';

export const africanDishes: MenuDish[] = [
  {
    id: 'af-1',
    name: 'Isombe with Fish',
    cuisine: 'AFRICAN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'spinach', qty: 2 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'af-2',
    name: 'Ugali with Beans',
    cuisine: 'AFRICAN',
    mealTypes: ['LUNCH', 'DINNER', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'red-onions', qty: 1 },
      { productId: 'carrots', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'af-3',
    name: 'Grilled Chicken & Avocado Salad',
    cuisine: 'AFRICAN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'avocados', qty: 1 },
      { productId: 'fresh-tomatoes', qty: 1 },
      { productId: 'red-onions', qty: 1 },
    ],
  },
  {
    id: 'af-4',
    name: 'Rice & Beef Stew',
    cuisine: 'AFRICAN',
    mealTypes: ['LUNCH', 'DINNER'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'rice', qty: 1 },
      { productId: 'fresh-tomatoes', qty: 1 },
      { productId: 'red-onions', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'af-5',
    name: 'Sweet Banana Porridge',
    cuisine: 'AFRICAN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'bananas', qty: 2 },
      { productId: 'fresh-milk', qty: 1 },
    ],
  },
  {
    id: 'af-6',
    name: 'Cabbage & Carrot Stir Fry',
    cuisine: 'AFRICAN',
    mealTypes: ['LUNCH', 'ALL_DAY'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'cabbage', qty: 2 },
      { productId: 'carrots', qty: 1 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
  {
    id: 'af-7',
    name: 'Egg & Green Bean Breakfast Plate',
    cuisine: 'AFRICAN',
    mealTypes: ['BREAKFAST'],
    source: FOODBUNDLES,
    ingredients: [
      { productId: 'eggs', qty: 1 },
      { productId: 'green-beans', qty: 1 },
    ],
  },
  {
    id: 'af-8',
    name: 'Potato & Spinach Curry',
    cuisine: 'AFRICAN',
    mealTypes: ['DINNER', 'ALL_DAY'],
    source: KIMIRONKO,
    ingredients: [
      { productId: 'irish-potatoes', qty: 1 },
      { productId: 'spinach', qty: 2 },
      { productId: 'cooking-oil', qty: 1 },
    ],
  },
];

import type { MenuDish, CuisineType, MealType } from '@/types';
import type { MarketComparisonRow } from '@/api/market.api';

export type { MenuDish, CuisineType, MealType };

export interface ConsolidatedIngredient {
  productId: string;
  qty: number;
  source: string;
}

/** Resolved at runtime from real market comparison data; falls back to 'FoodBundles'. */
let _cheapestMarket = 'FoodBundles';
let _secondMarket = 'Kimironko';

/** Call this with real comparison rows from the API to update dish source labels. */
export function updateMarketSources(rows: MarketComparisonRow[]): void {
  if (rows.length === 0) return;
  const sorted = [...rows].sort((a, b) => a.priceMultiplier - b.priceMultiplier);
  _cheapestMarket = sorted[0].market;
  _secondMarket = sorted[1]?.market ?? sorted[0].market;
}

function dishPhoto(photoId: string) {
  return { uri: `https://images.unsplash.com/${photoId}?w=480&h=320&fit=crop&q=80` };
}

const DISHES_BY_CUISINE: Record<CuisineType, MenuDish[]> = {
  AFRICAN: [
    { id: 'af-1', name: 'Isombe with Fish', cuisine: 'AFRICAN', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1604329760661-e71dc83f8f26'), ingredients: [{ productId: 'spinach', qty: 2 }, { productId: 'red-onions', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'af-2', name: 'Ugali with Beans', cuisine: 'AFRICAN', mealTypes: ['LUNCH', 'DINNER', 'ALL_DAY'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1585937421612-70a008356fbe'), ingredients: [{ productId: 'red-onions', qty: 1 }, { productId: 'carrots', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'af-3', name: 'Grilled Chicken & Avocado Salad', cuisine: 'AFRICAN', mealTypes: ['LUNCH', 'DINNER'], get source() { return _secondMarket; }, image: dishPhoto('photo-1598515214211-89d3c73ae83b'), ingredients: [{ productId: 'avocados', qty: 1 }, { productId: 'fresh-tomatoes', qty: 1 }, { productId: 'red-onions', qty: 1 }] },
    { id: 'af-4', name: 'Rice & Beef Stew', cuisine: 'AFRICAN', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1604908176997-125f25cc6f3d'), ingredients: [{ productId: 'rice', qty: 1 }, { productId: 'fresh-tomatoes', qty: 1 }, { productId: 'red-onions', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'af-5', name: 'Sweet Banana Porridge', cuisine: 'AFRICAN', mealTypes: ['BREAKFAST'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1517673400267-0251440c45dc'), ingredients: [{ productId: 'bananas', qty: 2 }, { productId: 'fresh-milk', qty: 1 }] },
    { id: 'af-6', name: 'Cabbage & Carrot Stir Fry', cuisine: 'AFRICAN', mealTypes: ['LUNCH', 'ALL_DAY'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1512058564366-18510be2db19'), ingredients: [{ productId: 'cabbage', qty: 2 }, { productId: 'carrots', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'af-7', name: 'Egg & Green Bean Breakfast Plate', cuisine: 'AFRICAN', mealTypes: ['BREAKFAST'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1525351484163-7529414344d8'), ingredients: [{ productId: 'eggs', qty: 1 }, { productId: 'green-beans', qty: 1 }] },
    { id: 'af-8', name: 'Potato & Spinach Curry', cuisine: 'AFRICAN', mealTypes: ['DINNER', 'ALL_DAY'], get source() { return _secondMarket; }, image: dishPhoto('photo-1631452180519-c014fe946bc7'), ingredients: [{ productId: 'irish-potatoes', qty: 1 }, { productId: 'spinach', qty: 2 }, { productId: 'cooking-oil', qty: 1 }] },
  ],
  INDIAN: [
    { id: 'in-1', name: 'Vegetable Biryani', cuisine: 'INDIAN', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1563379091339-03b21ab4a4f8'), ingredients: [{ productId: 'rice', qty: 2 }, { productId: 'carrots', qty: 1 }, { productId: 'red-onions', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'in-2', name: 'Aloo Gobi', cuisine: 'INDIAN', mealTypes: ['LUNCH', 'DINNER', 'ALL_DAY'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1585937421612-70a008356fbe'), ingredients: [{ productId: 'irish-potatoes', qty: 2 }, { productId: 'cabbage', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'in-3', name: 'Dal with Chapati', cuisine: 'INDIAN', mealTypes: ['BREAKFAST', 'LUNCH'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1546833999-b9f581a1996d'), ingredients: [{ productId: 'red-onions', qty: 1 }, { productId: 'fresh-tomatoes', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'in-4', name: 'Palak Paneer', cuisine: 'INDIAN', mealTypes: ['DINNER'], get source() { return _secondMarket; }, image: dishPhoto('photo-1631452180519-c014fe946bc7'), ingredients: [{ productId: 'spinach', qty: 3 }, { productId: 'fresh-tomatoes', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
  ],
  WESTERN: [
    { id: 'we-1', name: 'Chips & Egg', cuisine: 'WESTERN', mealTypes: ['BREAKFAST', 'ALL_DAY'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1525351484163-7529414344d8'), ingredients: [{ productId: 'irish-potatoes', qty: 2 }, { productId: 'eggs', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'we-2', name: 'Garden Salad', cuisine: 'WESTERN', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1512058564366-18510be2db19'), ingredients: [{ productId: 'cabbage', qty: 1 }, { productId: 'carrots', qty: 1 }, { productId: 'fresh-tomatoes', qty: 1 }] },
    { id: 'we-3', name: 'Vegetable Omelette', cuisine: 'WESTERN', mealTypes: ['BREAKFAST'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1604329760661-e71dc83f8f26'), ingredients: [{ productId: 'eggs', qty: 2 }, { productId: 'red-onions', qty: 1 }, { productId: 'fresh-tomatoes', qty: 1 }] },
    { id: 'we-4', name: 'Mashed Potato & Gravy', cuisine: 'WESTERN', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1604908176997-125f25cc6f3d'), ingredients: [{ productId: 'irish-potatoes', qty: 3 }, { productId: 'fresh-milk', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
  ],
  ASIAN: [
    { id: 'as-1', name: 'Stir-Fried Vegetables', cuisine: 'ASIAN', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1512058564366-18510be2db19'), ingredients: [{ productId: 'cabbage', qty: 1 }, { productId: 'carrots', qty: 1 }, { productId: 'red-onions', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'as-2', name: 'Fried Rice', cuisine: 'ASIAN', mealTypes: ['LUNCH', 'DINNER', 'ALL_DAY'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1563379091339-03b21ab4a4f8'), ingredients: [{ productId: 'rice', qty: 2 }, { productId: 'eggs', qty: 1 }, { productId: 'carrots', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'as-3', name: 'Vegetable Spring Rolls', cuisine: 'ASIAN', mealTypes: ['LUNCH', 'ALL_DAY'], get source() { return _secondMarket; }, image: dishPhoto('photo-1585937421612-70a008356fbe'), ingredients: [{ productId: 'cabbage', qty: 2 }, { productId: 'carrots', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
  ],
  MEDITERRANEAN: [
    { id: 'me-1', name: 'Greek Salad', cuisine: 'MEDITERRANEAN', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1512058564366-18510be2db19'), ingredients: [{ productId: 'fresh-tomatoes', qty: 2 }, { productId: 'red-onions', qty: 1 }, { productId: 'cabbage', qty: 1 }] },
    { id: 'me-2', name: 'Ratatouille', cuisine: 'MEDITERRANEAN', mealTypes: ['DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1604329760661-e71dc83f8f26'), ingredients: [{ productId: 'fresh-tomatoes', qty: 2 }, { productId: 'red-onions', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'me-3', name: 'Hummus & Veggie Plate', cuisine: 'MEDITERRANEAN', mealTypes: ['BREAKFAST', 'ALL_DAY'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1546833999-b9f581a1996d'), ingredients: [{ productId: 'carrots', qty: 1 }, { productId: 'cabbage', qty: 1 }] },
  ],
  FUSION: [
    { id: 'fu-1', name: 'Avocado & Tomato Toast', cuisine: 'FUSION', mealTypes: ['BREAKFAST', 'ALL_DAY'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1598515214211-89d3c73ae83b'), ingredients: [{ productId: 'avocados', qty: 1 }, { productId: 'fresh-tomatoes', qty: 1 }] },
    { id: 'fu-2', name: 'Potato Curry Bowl', cuisine: 'FUSION', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1631452180519-c014fe946bc7'), ingredients: [{ productId: 'irish-potatoes', qty: 2 }, { productId: 'fresh-tomatoes', qty: 1 }, { productId: 'red-onions', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
    { id: 'fu-3', name: 'Carrot & Ginger Soup', cuisine: 'FUSION', mealTypes: ['LUNCH', 'DINNER'], get source() { return _cheapestMarket; }, image: dishPhoto('photo-1604908176997-125f25cc6f3d'), ingredients: [{ productId: 'carrots', qty: 3 }, { productId: 'red-onions', qty: 1 }, { productId: 'cooking-oil', qty: 1 }] },
  ],
};

/** Returns dishes for a cuisine filtered by meal types. */
export function getDishesForMenu(cuisine: CuisineType, mealTypes: MealType[]): MenuDish[] {
  return DISHES_BY_CUISINE[cuisine].filter((dish) =>
    dish.mealTypes.some((meal) => mealTypes.includes(meal)),
  );
}

/**
 * Merges every ingredient across a set of dishes into one de-duplicated, summed shopping
 * list, sorted with FoodBundles-sourced items first, then by productId.
 */
export function consolidateIngredients(dishes: MenuDish[]): ConsolidatedIngredient[] {
  const byProduct = new Map<string, ConsolidatedIngredient>();

  for (const dish of dishes) {
    for (const ingredient of dish.ingredients) {
      const existing = byProduct.get(ingredient.productId);
      if (existing) {
        existing.qty += ingredient.qty;
      } else {
        byProduct.set(ingredient.productId, {
          productId: ingredient.productId,
          qty: ingredient.qty,
          source: dish.source,
        });
      }
    }
  }

  return Array.from(byProduct.values()).sort((a, b) => {
    if (a.source !== b.source) return a.source === _cheapestMarket ? -1 : 1;
    return a.productId.localeCompare(b.productId);
  });
}

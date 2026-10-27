import type { BuyingAdviceItem } from '@/api/market.api';

export type { BuyingAdviceItem };

/** Maps each tracked commodity to its matching product id for cart-add purposes. */
export const COMMODITY_PRODUCT_ID: Record<string, string> = {
  irishPotatoes: 'irish-potatoes',
  tomatoes: 'fresh-tomatoes',
  redOnions: 'red-onions',
  cabbage: 'cabbage',
  carrots: 'carrots',
};

/** Empty fallback — real data always comes from the market API. */
export function computeBuyingAdvice(): { buyNow: BuyingAdviceItem[]; wait: BuyingAdviceItem[]; neutral: BuyingAdviceItem[] } {
  return { buyNow: [], wait: [], neutral: [] };
}

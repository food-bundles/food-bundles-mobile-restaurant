import type { Order } from '@/types';
import type { MarketComparisonRow } from '@/api/market.api';

export type PriceHistoryRange = 'WEEK' | 'MONTH' | 'QUARTER';

const RANGE_DAYS: Record<PriceHistoryRange, number> = { WEEK: 7, MONTH: 30, QUARTER: 90 };

/** Filters orders to those placed within the selected range, measured back from the latest order. */
export function filterOrdersByRange(orders: Order[], range: PriceHistoryRange): Order[] {
  if (orders.length === 0) return orders;
  const latest = Math.max(...orders.map((order) => new Date(order.placedAt).getTime()));
  const cutoff = latest - RANGE_DAYS[range] * 24 * 60 * 60 * 1000;
  return orders.filter((order) => new Date(order.placedAt).getTime() >= cutoff);
}

export interface OrderPricePoint {
  orderId: string;
  placedAt: string;
  pricePerUnit: number;
}

export interface ItemComparison {
  productId: string;
  name: string;
  points: OrderPricePoint[];
  avgPaid: number;
  vsMarketPct: Record<string, number>;
}

/**
 * Builds, per product, every order the restaurant placed for it (with the price paid at
 * order time) plus how that average compares to each tracked market's real price.
 * Pass `marketComparison` rows from the API series endpoint for accurate vsMarketPct.
 */
export function computeItemComparisons(orders: Order[], marketComparison: MarketComparisonRow[] = []): ItemComparison[] {
  const byProduct = new Map<string, ItemComparison>();

  for (const order of orders) {
    for (const line of order.lines) {
      if (line.pricePerUnitAtOrderTime === undefined) continue;
      const existing = byProduct.get(line.productId);
      const point: OrderPricePoint = {
        orderId: order.id,
        placedAt: order.placedAt,
        pricePerUnit: line.pricePerUnitAtOrderTime,
      };
      if (existing) {
        existing.points.push(point);
      } else {
        byProduct.set(line.productId, {
          productId: line.productId,
          name: line.name,
          points: [point],
          avgPaid: 0,
          vsMarketPct: {},
        });
      }
    }
  }

  return Array.from(byProduct.values())
    .map((item) => {
      const avgPaid = item.points.reduce((sum, p) => sum + p.pricePerUnit, 0) / item.points.length;
      const vsMarketPct: Record<string, number> = {};
      for (const row of marketComparison) {
        const marketPrice = avgPaid * row.priceMultiplier;
        vsMarketPct[row.market] = ((avgPaid - marketPrice) / marketPrice) * 100;
      }
      return { ...item, avgPaid, vsMarketPct };
    })
    .sort((a, b) => b.avgPaid * b.points.length - a.avgPaid * a.points.length);
}

export interface ComparisonSummary {
  avgVsBenchmarkPct: number;
  savedVsKimironkoRwf: number;
}

/** Rolls every item comparison into one top-line summary: avg % vs. markets, and RWF saved vs. the most expensive market. */
export function computeComparisonSummary(items: ItemComparison[]): ComparisonSummary {
  if (items.length === 0) return { avgVsBenchmarkPct: 0, savedVsKimironkoRwf: 0 };

  const allMarkets = items.flatMap((item) => Object.keys(item.vsMarketPct));
  const uniqueMarkets = [...new Set(allMarkets)];
  const mostExpensive = uniqueMarkets.length > 0
    ? uniqueMarkets.reduce((max, m) => {
        const avg = items.reduce((s, i) => s + (i.vsMarketPct[m] ?? 0), 0) / items.length;
        const maxAvg = items.reduce((s, i) => s + (i.vsMarketPct[max] ?? 0), 0) / items.length;
        return avg > maxAvg ? m : max;
      })
    : null;

  const avgVsBenchmarkPct = uniqueMarkets.length > 0
    ? items.reduce((sum, item) => {
        const avg = Object.values(item.vsMarketPct).reduce((s, v) => s + v, 0) / (Object.keys(item.vsMarketPct).length || 1);
        return sum + avg;
      }, 0) / items.length
    : 0;

  const savedVsKimironkoRwf = mostExpensive
    ? items.reduce((sum, item) => {
        const pct = item.vsMarketPct[mostExpensive] ?? 0;
        const marketPrice = item.avgPaid / (1 + pct / 100);
        return sum + (marketPrice - item.avgPaid) * item.points.length;
      }, 0)
    : 0;

  return { avgVsBenchmarkPct, savedVsKimironkoRwf };
}

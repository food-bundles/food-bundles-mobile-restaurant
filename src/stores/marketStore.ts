import { create } from 'zustand';
import {
  getMarketPricesApi,
  getMarketSeriesApi,
  getMarketAdviceApi,
  getMarketRankingApi,
  getRestaurantDirectoryApi,
  type MarketDashboard,
  type BuyingAdvice,
  type RankingData,
  type DirectoryRestaurant,
  type PriceSeriesData,
} from '@/api/market.api';
import type { CommodityId } from '@/api/market.api';

interface MarketState {
  dashboard: MarketDashboard | null;
  advice: BuyingAdvice | null;
  ranking: RankingData | null;
  directory: DirectoryRestaurant[];
  seriesCache: Partial<Record<string, PriceSeriesData>>;
  status: 'idle' | 'loading' | 'ready' | 'error';
  fetchDashboard: () => Promise<void>;
  fetchAdvice: () => Promise<void>;
  fetchRanking: () => Promise<void>;
  fetchDirectory: () => Promise<void>;
  fetchSeries: (commodityId: CommodityId, range?: '1D' | '7D' | '1M' | '3M') => Promise<PriceSeriesData | null>;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  dashboard: null,
  advice: null,
  ranking: null,
  directory: [],
  seriesCache: {},
  status: 'idle',

  fetchDashboard: async () => {
    if (get().dashboard) return;
    set({ status: 'loading' });
    try {
      const dashboard = await getMarketPricesApi();
      set({ dashboard, status: 'ready' });
    } catch {
      set({ status: 'error' });
    }
  },

  fetchAdvice: async () => {
    try {
      const advice = await getMarketAdviceApi();
      set({ advice });
    } catch {
      // non-fatal
    }
  },

  fetchRanking: async () => {
    try {
      const ranking = await getMarketRankingApi();
      set({ ranking });
    } catch {
      // non-fatal
    }
  },

  fetchDirectory: async () => {
    if (get().directory.length > 0) return;
    try {
      const directory = await getRestaurantDirectoryApi();
      set({ directory });
    } catch {
      // non-fatal
    }
  },

  fetchSeries: async (commodityId, range = '7D') => {
    const key = `${commodityId}-${range}`;
    const cached = get().seriesCache[key];
    if (cached) return cached;
    try {
      const series = await getMarketSeriesApi(commodityId, range);
      set((state) => ({ seriesCache: { ...state.seriesCache, [key]: series } }));
      return series;
    } catch {
      return null;
    }
  },
}));

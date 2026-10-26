import { request } from './client';

export type CommodityId = 'irishPotatoes' | 'tomatoes' | 'redOnions' | 'cabbage' | 'carrots';

export interface CommodityInfo {
  id: CommodityId;
  name: string;
  unit: string;
}

export interface OhlcDay {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MomentumReading {
  direction: 'UP' | 'FLAT' | 'DOWN';
  magnitudePct: number;
}

export interface MarketComparisonRow {
  market: string;
  priceMultiplier: number;
  stock: 'HIGH' | 'MEDIUM' | 'LOW';
  trend: number[];
  isFoodBundles?: boolean;
}

export type TimeRange = '1D' | '7D' | '1M' | '3M';

export interface ApiCommodityDashboard {
  id: CommodityId;
  name: string;
  unit: string;
  latestPrice: number;
  momentum: MomentumReading;
  changePct: number;
  ohlc: OhlcDay[];
  rsi: number;
  history: { date: string; price: number }[];
}

export interface MarketDashboard {
  commodities: ApiCommodityDashboard[];
  watchlist: CommodityId[];
  mostActive: CommodityId[];
  updatedAt: string | null;
}

export interface PriceSeriesData {
  commodityId: CommodityId;
  range: string;
  series: { date: string; price: number }[];
  comparison: MarketComparisonRow[];
  ohlc: OhlcDay[];
  rsi: number;
}

export interface BuyingAdviceItem {
  commodityId: CommodityId;
  name: string;
  unit: string;
  todayPrice: number;
  weeklyAveragePrice: number;
  changeFraction: number;
}

export interface BuyingAdvice {
  buyNow: BuyingAdviceItem[];
  wait: BuyingAdviceItem[];
  neutral: BuyingAdviceItem[];
  updatedAt: string;
}

export interface PeerIngredientCost {
  productId: string;
  name: string;
  yourCost: number;
  peerAvgCost: number;
}

export interface RankingData {
  yourMonthlyVolume: number;
  peerAvgOrderSize: number;
  yourAvgOrderSize: number;
  yourLocation: string;
  marketsWithinReach: number;
  totalMarketsTracked: number;
  yourCostPerCover: number;
  peerMedianCostPerCover: number;
  costPerCoverTrend: number[];
  menuMarkupMultiplier: number;
  peerIngredientCosts: PeerIngredientCost[];
  nearbyMarketPrices: { marketName: string; productId: string; name: string; price: number }[];
}

export interface DirectoryRestaurant {
  id: string;
  name: string;
  neighborhood: string;
}

export async function getMarketPricesApi(): Promise<MarketDashboard> {
  const res = await request<{ data: MarketDashboard }>('/market/prices');
  return res.data;
}

export async function getMarketSeriesApi(
  commodityId: CommodityId,
  range: '1D' | '7D' | '1M' | '3M' = '7D',
): Promise<PriceSeriesData> {
  const res = await request<{ data: PriceSeriesData }>(
    `/market/prices/${commodityId}/series?range=${range}`,
  );
  return res.data;
}

export async function getMarketAdviceApi(): Promise<BuyingAdvice> {
  const res = await request<{ data: BuyingAdvice }>('/market/advice');
  return res.data;
}

export async function getMarketRankingApi(): Promise<RankingData> {
  const res = await request<{ data: RankingData }>('/market/ranking');
  return res.data;
}

export interface Substitution {
  fromProductId: string;
  toProductId: string;
  note: string;
}

export interface OrderTimingInsight {
  productId: string;
  cheaperDay: string;
  cheaperDayAvg: number;
  pricierDay: string;
  pricierDayAvg: number;
}

export async function getOrderTimingInsightsApi(): Promise<OrderTimingInsight[]> {
  const res = await request<{ data: OrderTimingInsight[] }>('/market/order-timing-insights');
  return res.data;
}

export async function getRestaurantDirectoryApi(): Promise<DirectoryRestaurant[]> {
  const res = await request<{ data: DirectoryRestaurant[] }>('/market/restaurant-directory');
  return res.data;
}

export async function getSubstitutionsApi(): Promise<Substitution[]> {
  const res = await request<{ data: Substitution[] }>('/market/substitutions');
  return res.data;
}

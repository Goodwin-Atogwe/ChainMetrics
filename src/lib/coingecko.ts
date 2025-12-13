const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: {
    price: number[];
  };
  last_updated: string;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
  description: {
    en: string;
  };
}

export interface PriceHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export type SupportedCurrency = 'usd' | 'eur' | 'gbp' | 'jpy' | 'aud' | 'cad' | 'chf' | 'cny';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
  jpy: '¥',
  aud: 'A$',
  cad: 'C$',
  chf: 'CHF',
  cny: '¥',
};

export const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  usd: 'US Dollar',
  eur: 'Euro',
  gbp: 'British Pound',
  jpy: 'Japanese Yen',
  aud: 'Australian Dollar',
  cad: 'Canadian Dollar',
  chf: 'Swiss Franc',
  cny: 'Chinese Yuan',
};

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const response = await fetch(url);
  
  if (response.status === 429) {
    throw new Error('Rate limit exceeded. Please wait a moment.');
  }
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

export async function getMarketData(
  currency: SupportedCurrency = 'usd',
  page: number = 1,
  perPage: number = 50
): Promise<CoinMarketData[]> {
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;
  return fetchWithCache<CoinMarketData[]>(url);
}

export async function getCoinDetail(coinId: string): Promise<CoinDetail> {
  const url = `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;
  return fetchWithCache<CoinDetail>(url);
}

export async function getPriceHistory(
  coinId: string,
  currency: SupportedCurrency = 'usd',
  days: number = 7
): Promise<PriceHistory> {
  const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;
  return fetchWithCache<PriceHistory>(url);
}

export async function searchCoins(query: string): Promise<{ id: string; name: string; symbol: string; thumb: string }[]> {
  if (!query.trim()) return [];
  const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}`;
  const data = await fetchWithCache<{ coins: { id: string; name: string; symbol: string; thumb: string }[] }>(url);
  return data.coins.slice(0, 10);
}

export function formatPrice(price: number, currency: SupportedCurrency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (price >= 1) {
    return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatPercentage(value: number): string {
  const formatted = Math.abs(value).toFixed(2);
  return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
}

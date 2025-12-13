import { useQuery } from '@tanstack/react-query';
import { 
  getMarketData, 
  getPriceHistory, 
  searchCoins,
  type SupportedCurrency,
  type CoinMarketData,
  type PriceHistory
} from '@/lib/coingecko';

const POLLING_INTERVAL = 30000; // 30 seconds

export function useMarketData(currency: SupportedCurrency, page: number = 1) {
  return useQuery<CoinMarketData[], Error>({
    queryKey: ['marketData', currency, page],
    queryFn: () => getMarketData(currency, page),
    refetchInterval: POLLING_INTERVAL,
    staleTime: 15000,
    retry: 2,
  });
}

export function usePriceHistory(coinId: string | null, currency: SupportedCurrency, days: number = 7) {
  return useQuery<PriceHistory, Error>({
    queryKey: ['priceHistory', coinId, currency, days],
    queryFn: () => getPriceHistory(coinId!, currency, days),
    enabled: !!coinId,
    refetchInterval: POLLING_INTERVAL,
    staleTime: 15000,
    retry: 2,
  });
}

export function useSearchCoins(query: string) {
  return useQuery({
    queryKey: ['searchCoins', query],
    queryFn: () => searchCoins(query),
    enabled: query.length >= 2,
    staleTime: 60000,
  });
}


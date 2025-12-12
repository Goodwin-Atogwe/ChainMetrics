import { useState } from 'react';
import { Header } from '@/components/Header';
import { CryptoTable } from '@/components/CryptoTable';
import { PriceChart } from '@/components/PriceChart';
import { MarketStats } from '@/components/MarketStats';
import { LoadingState, ErrorState } from '@/components/LoadingState';
import { useMarketData } from '@/hooks/useCryptoData';
import type { SupportedCurrency, CoinMarketData } from '@/lib/coingecko';

const Index = () => {
  const [currency, setCurrency] = useState<SupportedCurrency>('usd');
  const [selectedCoin, setSelectedCoin] = useState<CoinMarketData | null>(null);
  
  const { data: coins, isLoading, error, refetch, isFetching } = useMarketData(currency);

  const lastUpdated = coins?.[0]?.last_updated || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.02] pointer-events-none" />
      
      <div className="relative">
        <Header
          currency={currency}
          onCurrencyChange={setCurrency}
          onSelectCoin={setSelectedCoin}
          isRefetching={isFetching}
          lastUpdated={lastUpdated}
        />

        <main className="container py-6 space-y-6">
          {/* Market Stats */}
          {coins && coins.length > 0 && (
            <MarketStats coins={coins} currency={currency} />
          )}

          {/* Price Chart */}
          {selectedCoin && (
            <PriceChart
              coin={selectedCoin}
              currency={currency}
              onClose={() => setSelectedCoin(null)}
            />
          )}

          {/* Crypto Table */}
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error.message} onRetry={() => refetch()} />
          ) : coins && coins.length > 0 ? (
            <CryptoTable
              coins={coins}
              currency={currency}
              selectedCoinId={selectedCoin?.id || null}
              onSelectCoin={setSelectedCoin}
            />
          ) : null}

          {/* Footer */}
          <footer className="text-center py-6 text-sm text-muted-foreground">
            <p>
              Data provided by{' '}
              <a
                href="https://www.coingecko.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                CoinGecko
              </a>
              {' '}• Auto-refreshes every 30 seconds
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;

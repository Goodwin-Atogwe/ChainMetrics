import { Activity, RefreshCw } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { SearchBar } from './SearchBar';
import type { SupportedCurrency, CoinMarketData } from '@/lib/coingecko';

interface HeaderProps {
  currency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onSelectCoin: (coin: CoinMarketData) => void;
  isRefetching: boolean;
  lastUpdated: string | null;
}

export function Header({ 
  currency, 
  onCurrencyChange, 
  onSelectCoin,
  isRefetching,
  lastUpdated 
}: HeaderProps) {
  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/50">
      <div className="container py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Activity className="relative h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Chain<span className="text-primary">Metrics</span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isRefetching && (
                  <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                )}
                <span>
                  {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : 'Live data'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar onSelectCoin={onSelectCoin} currency={currency} />
            <CurrencySelector value={currency} onChange={onCurrencyChange} />
          </div>
        </div>
      </div>
    </header>
  );
}

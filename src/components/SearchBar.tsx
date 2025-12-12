import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchCoins, useMarketData } from '@/hooks/useCryptoData';
import type { SupportedCurrency, CoinMarketData } from '@/lib/coingecko';

interface SearchBarProps {
  onSelectCoin: (coin: CoinMarketData) => void;
  currency: SupportedCurrency;
}

export function SearchBar({ onSelectCoin, currency }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: searchResults, isLoading } = useSearchCoins(query);
  const { data: marketData } = useMarketData(currency);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: { id: string; name: string; symbol: string }) => {
    const coinData = marketData?.find(c => c.id === result.id);
    if (coinData) {
      onSelectCoin(coinData);
    }
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full sm:w-[280px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search coins..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-8 bg-secondary border-border"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden shadow-xl z-50">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Searching...
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <ul className="max-h-[300px] overflow-y-auto scrollbar-thin">
              {searchResults.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <img
                      src={result.thumb}
                      alt={result.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-foreground">{result.name}</div>
                      <div className="text-xs text-muted-foreground uppercase font-mono">
                        {result.symbol}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

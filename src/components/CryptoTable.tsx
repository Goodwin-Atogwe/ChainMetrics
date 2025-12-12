import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice, formatLargeNumber, formatPercentage, type SupportedCurrency, type CoinMarketData, CURRENCY_SYMBOLS } from '@/lib/coingecko';
import { SparklineChart } from './SparklineChart';

interface CryptoTableProps {
  coins: CoinMarketData[];
  currency: SupportedCurrency;
  selectedCoinId: string | null;
  onSelectCoin: (coin: CoinMarketData) => void;
}

export function CryptoTable({ coins, currency, selectedCoinId, onSelectCoin }: CryptoTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="sticky left-0 bg-card/95 backdrop-blur-sm px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                #
              </th>
              <th className="sticky left-12 bg-card/95 backdrop-blur-sm px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[180px]">
                Coin
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                24h
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                7d
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Market Cap
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                Volume (24h)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden xl:table-cell min-w-[140px]">
                Last 7 Days
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {coins.map((coin) => (
              <CryptoRow
                key={coin.id}
                coin={coin}
                currency={currency}
                isSelected={coin.id === selectedCoinId}
                onSelect={() => onSelectCoin(coin)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CryptoRowProps {
  coin: CoinMarketData;
  currency: SupportedCurrency;
  isSelected: boolean;
  onSelect: () => void;
}

function CryptoRow({ coin, currency, isSelected, onSelect }: CryptoRowProps) {
  const priceChange24h = coin.price_change_percentage_24h ?? 0;
  const priceChange7d = coin.price_change_percentage_7d_in_currency ?? 0;
  const isPositive24h = priceChange24h >= 0;
  const isPositive7d = priceChange7d >= 0;

  return (
    <tr
      onClick={onSelect}
      className={cn(
        'cursor-pointer transition-all duration-200 hover:bg-secondary/50',
        isSelected && 'bg-primary/5 hover:bg-primary/10'
      )}
    >
      <td className="sticky left-0 bg-card/95 backdrop-blur-sm px-4 py-4 text-sm font-mono text-muted-foreground">
        {coin.market_cap_rank}
      </td>
      <td className="sticky left-12 bg-card/95 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium text-foreground">{coin.name}</div>
            <div className="text-xs text-muted-foreground uppercase font-mono">
              {coin.symbol}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="font-mono text-foreground">
          {formatPrice(coin.current_price, currency)}
        </span>
      </td>
      <td className="px-4 py-4 text-right">
        <div className={cn(
          'inline-flex items-center gap-1 font-mono text-sm',
          isPositive24h ? 'text-success' : 'text-destructive'
        )}>
          {isPositive24h ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {formatPercentage(priceChange24h)}
        </div>
      </td>
      <td className="px-4 py-4 text-right hidden sm:table-cell">
        <div className={cn(
          'inline-flex items-center gap-1 font-mono text-sm',
          isPositive7d ? 'text-success' : 'text-destructive'
        )}>
          {formatPercentage(priceChange7d)}
        </div>
      </td>
      <td className="px-4 py-4 text-right hidden md:table-cell">
        <span className="font-mono text-muted-foreground">
          {CURRENCY_SYMBOLS[currency]}{formatLargeNumber(coin.market_cap)}
        </span>
      </td>
      <td className="px-4 py-4 text-right hidden lg:table-cell">
        <span className="font-mono text-muted-foreground">
          {CURRENCY_SYMBOLS[currency]}{formatLargeNumber(coin.total_volume)}
        </span>
      </td>
      <td className="px-4 py-4 text-right hidden xl:table-cell">
        {coin.sparkline_in_7d?.price && (
          <SparklineChart
            data={coin.sparkline_in_7d.price}
            isPositive={isPositive7d}
          />
        )}
      </td>
    </tr>
  );
}

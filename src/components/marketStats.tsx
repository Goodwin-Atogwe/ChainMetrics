import { TrendingUp, BarChart3, Coins } from 'lucide-react';
import { formatLargeNumber, CURRENCY_SYMBOLS, type SupportedCurrency, type CoinMarketData } from '@/lib/coingecko';

interface MarketStatsProps {
  coins: CoinMarketData[];
  currency: SupportedCurrency;
}

export function MarketStats({ coins, currency }: MarketStatsProps) {
  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);
  const gainers = coins.filter(c => c.price_change_percentage_24h > 0).length;
  const gainersPercentage = Math.round((gainers / coins.length) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={<Coins className="h-5 w-5" />}
        label="Total Market Cap"
        value={`${CURRENCY_SYMBOLS[currency]}${formatLargeNumber(totalMarketCap)}`}
        sublabel={`Top ${coins.length} coins`}
      />
      <StatCard
        icon={<BarChart3 className="h-5 w-5" />}
        label="24h Volume"
        value={`${CURRENCY_SYMBOLS[currency]}${formatLargeNumber(totalVolume)}`}
        sublabel="Trading activity"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Market Sentiment"
        value={`${gainersPercentage}%`}
        sublabel={`${gainers} of ${coins.length} coins up`}
        isPositive={gainersPercentage > 50}
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  isPositive?: boolean;
}

function StatCard({ icon, label, value, sublabel, isPositive }: StatCardProps) {
  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-xl font-mono font-bold ${isPositive !== undefined ? (isPositive ? 'text-success' : 'text-destructive') : 'text-foreground'}`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
    </div>
  );
}

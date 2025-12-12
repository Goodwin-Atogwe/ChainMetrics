import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePriceHistory } from '@/hooks/useCryptoData';
import { formatPrice, formatLargeNumber, CURRENCY_SYMBOLS, type SupportedCurrency, type CoinMarketData } from '@/lib/coingecko';
import { Button } from '@/components/ui/button';

interface PriceChartProps {
  coin: CoinMarketData;
  currency: SupportedCurrency;
  onClose: () => void;
}

const TIME_RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export function PriceChart({ coin, currency, onClose }: PriceChartProps) {
  const [days, setDays] = useState(7);
  const { data: priceHistory, isLoading, error } = usePriceHistory(coin.id, currency, days);

  const chartData = useMemo(() => {
    if (!priceHistory?.prices) return [];
    return priceHistory.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  }, [priceHistory]);

  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].price;
    const last = chartData[chartData.length - 1].price;
    return ((last - first) / first) * 100;
  }, [chartData]);

  const isPositive = priceChange >= 0;
  const strokeColor = isPositive ? 'hsl(160, 84%, 45%)' : 'hsl(0, 72%, 55%)';

  return (
    <div className="glass-card p-4 md:p-6 animate-slide-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">{coin.name}</h2>
              <span className="text-sm font-mono text-muted-foreground uppercase">
                {coin.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-mono font-bold text-foreground">
                {formatPrice(coin.current_price, currency)}
              </span>
              <div className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-mono',
                isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-secondary rounded-lg p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range.days}
                onClick={() => setDays(range.days)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                  days === range.days
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Market Cap"
          value={`${CURRENCY_SYMBOLS[currency]}${formatLargeNumber(coin.market_cap)}`}
        />
        <StatCard
          label="24h Volume"
          value={`${CURRENCY_SYMBOLS[currency]}${formatLargeNumber(coin.total_volume)}`}
        />
        <StatCard
          label="24h Change"
          value={`${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h?.toFixed(2)}%`}
          isPositive={coin.price_change_percentage_24h >= 0}
        />
        <StatCard
          label="Rank"
          value={`#${coin.market_cap_rank}`}
        />
      </div>

      <div className="h-[300px] md:h-[400px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground text-sm">Loading chart...</span>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-destructive text-sm">{error.message}</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey={days === 1 ? 'time' : 'date'}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                minTickGap={50}
              />
              <YAxis
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                tickFormatter={(value) => formatPrice(value, currency)}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card p-3 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {data.date} {data.time}
                        </p>
                        <p className="font-mono text-lg text-foreground">
                          {formatPrice(data.price, currency)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#chartGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  isPositive?: boolean;
}

function StatCard({ label, value, isPositive }: StatCardProps) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn(
        'font-mono font-medium',
        isPositive !== undefined
          ? isPositive ? 'text-success' : 'text-destructive'
          : 'text-foreground'
      )}>
        {value}
      </p>
    </div>
  );
}

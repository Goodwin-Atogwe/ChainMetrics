import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCY_NAMES, CURRENCY_SYMBOLS, type SupportedCurrency } from '@/lib/coingecko';

interface CurrencySelectorProps {
  value: SupportedCurrency;
  onChange: (value: SupportedCurrency) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const currencies = Object.keys(CURRENCY_NAMES) as SupportedCurrency[];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px] bg-secondary border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {currencies.map((currency) => (
          <SelectItem 
            key={currency} 
            value={currency}
            className="focus:bg-secondary"
          >
            <span className="flex items-center gap-2">
              <span className="font-mono text-primary">{CURRENCY_SYMBOLS[currency]}</span>
              <span className="text-muted-foreground">{currency.toUpperCase()}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

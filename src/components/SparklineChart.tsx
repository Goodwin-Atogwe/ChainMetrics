import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SparklineChartProps {
  data: number[];
  isPositive: boolean;
  className?: string;
}

export function SparklineChart({ data, isPositive, className }: SparklineChartProps) {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return '';

    const width = 120;
    const height = 40;
    const padding = 2;

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data]);

  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  if (!pathData) return null;

  return (
    <svg
      viewBox="0 0 120 40"
      className={cn('w-[120px] h-[40px]', className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor={isPositive ? 'hsl(160, 84%, 45%)' : 'hsl(0, 72%, 55%)'}
            stopOpacity="0.3"
          />
          <stop
            offset="100%"
            stopColor={isPositive ? 'hsl(160, 84%, 45%)' : 'hsl(0, 72%, 55%)'}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke={isPositive ? 'hsl(160, 84%, 45%)' : 'hsl(0, 72%, 55%)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

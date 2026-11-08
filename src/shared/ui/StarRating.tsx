import { Star } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface StarRatingProps {
  readonly value: number;
  readonly max?: number;
  readonly size?: 'xs' | 'sm' | 'md';
  readonly className?: string;
}

const sizeMap = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
} as const;

export function StarRating({ value, max = 5, size = 'sm', className }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(max, value));
  const fullStars = Math.round(clamped);

  return (
    <span
      role="img"
      aria-label={`Rated ${clamped.toFixed(1)} out of ${max} stars`}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {Array.from({ length: max }, (_, idx) => {
        const isFilled = idx < fullStars;
        return (
          <Star
            key={idx}
            className={cn(
              sizeMap[size],
              isFilled
                ? 'fill-current text-zinc-900 dark:text-zinc-100'
                : 'fill-none text-zinc-400 dark:text-zinc-600',
            )}
          />
        );
      })}
    </span>
  );
}

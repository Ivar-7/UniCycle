import { Check } from 'lucide-react';
import { StarRating } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { CATEGORIES, COLOURS, PRICE_MAX, PRICE_MIN, RATINGS } from '../api/marketplace.api';
import type {
  MarketplaceFilters,
  ProductCategory,
  ProductColour,
  RatingFilterValue,
} from '../api/marketplace.types';

export interface FilterSidebarProps {
  readonly filters: MarketplaceFilters;
  readonly categoryCounts: Record<ProductCategory, number>;
  readonly onToggleCategory: (category: ProductCategory) => void;
  readonly onToggleColour: (colour: ProductColour) => void;
  readonly onPriceChange: (minPrice: number, maxPrice: number) => void;
  readonly onToggleInStock: (inStock: boolean) => void;
  readonly onSelectRating: (rating: RatingFilterValue) => void;
}

export function FilterSidebar({
  filters,
  categoryCounts,
  onToggleCategory,
  onToggleColour,
  onPriceChange,
  onToggleInStock,
  onSelectRating,
}: FilterSidebarProps) {
  return (
    <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
      {/* Category */}
      <fieldset className=" flex flex-col gap-3 pb-6">
        <legend className="mb-3 text-xs font-normal uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Category
        </legend>
        {CATEGORIES.map((category) => {
          const count = categoryCounts[category.value] ?? 0;
          const checked = filters.categories.includes(category.value);
          const isDisabled = count === 0 && !checked;

          return (
            <label
              key={category.value}
              className={cn(
                'group flex cursor-pointer items-center gap-3 text-sm select-none',
                isDisabled && 'cursor-not-allowed opacity-40',
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={isDisabled}
                onClick={() => onToggleCategory(category.value)}
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
                  checked
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                    : 'border-zinc-400 bg-transparent group-hover:border-zinc-600 dark:border-zinc-600 dark:group-hover:border-zinc-400',
                )}
              >
                {checked ? <Check className="h-3 w-3 stroke-3" /> : null}
              </button>
              <span className="font-normal text-zinc-800 dark:text-zinc-200">{category.label}</span>
              <span className="ml-auto text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                {count}
              </span>
            </label>
          );
        })}
      </fieldset>

      {/* Price */}
      <fieldset className="flex flex-col gap-4 py-6">
        <legend className="text-xs font-normal uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Price
        </legend>
        <div className="pt-2">
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={filters.maxPrice}
            aria-label="Maximum price"
            onChange={(e) => onPriceChange(filters.minPrice, Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-100"
          />
        </div>
        <div className="flex items-center justify-between text-sm tabular-nums text-zinc-800 dark:text-zinc-200">
          <span>${filters.minPrice}</span>
          <span>
            ${filters.maxPrice}
            {filters.maxPrice === PRICE_MAX ? '+' : ''}
          </span>
        </div>
      </fieldset>

      {/* Colour */}
      <fieldset className="flex flex-col gap-3 py-6">
        <legend className="text-xs font-normal uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Colour
        </legend>
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {COLOURS.map((colour) => {
            const selected = filters.colours.includes(colour.value);
            return (
              <button
                key={colour.value}
                type="button"
                aria-label={colour.label}
                aria-pressed={selected}
                title={colour.label}
                onClick={() => onToggleColour(colour.value)}
                className={cn(
                  'h-7 w-7 rounded-full border border-zinc-300 transition-transform hover:scale-105 dark:border-zinc-700',
                  colour.bgClass,
                  selected &&
                    'ring-2 ring-zinc-900 ring-offset-2 ring-offset-white dark:ring-zinc-100 dark:ring-offset-zinc-950',
                )}
              />
            );
          })}
        </div>
      </fieldset>

      {/* In Stock Only */}
      <div className="flex items-center justify-between py-6">
        <span className="text-sm font-normal text-zinc-800 dark:text-zinc-200">In stock only</span>
        <button
          type="button"
          role="switch"
          aria-checked={filters.inStock}
          aria-label="In stock only"
          onClick={() => onToggleInStock(!filters.inStock)}
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors',
            filters.inStock ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-300 dark:bg-zinc-800',
          )}
        >
          <span
            className={cn(
              'inline-block h-3.5 w-3.5 rounded-full transition-transform',
              filters.inStock
                ? 'translate-x-4 bg-white dark:bg-zinc-950'
                : 'translate-x-0.5 bg-white dark:bg-zinc-400',
            )}
          />
        </button>
      </div>

      {/* Rating */}
      <fieldset className="flex flex-col gap-3 pt-6">
        <legend className="mb-2 text-xs font-normal uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Rating
        </legend>
        {RATINGS.map((option) => {
          const isSelected = filters.rating === option.value;
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-800 select-none dark:text-zinc-200"
            >
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectRating(option.value)}
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full border transition-colors',
                  isSelected
                    ? 'border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100'
                    : 'border-zinc-400 bg-transparent dark:border-zinc-600',
                )}
              >
                {isSelected ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-white dark:bg-zinc-950" />
                ) : null}
              </button>
              <span className="inline-flex items-center gap-2 font-normal">
                {option.min > 0 ? <StarRating value={option.min} size="xs" /> : null}
                <span>{option.label}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}

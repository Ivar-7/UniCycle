import { ChevronDown, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '@/shared/hooks/usePreferences';
import { Button, EmptyState, ErrorState, LoadingState, UniCycleLogo } from '@/shared/ui';
import { SORTS } from '../api/marketplace.api';
import type { SortOptionValue } from '../api/marketplace.types';
import { useMarketplace } from '../state/useMarketplace';
import { FilterSidebar } from './FilterSidebar';
import { ProductGridCard } from './ProductGridCard';
import { SneakerProductHero } from './SneakerProductHero';

export function MarketplaceOverview() {
  const { formatPrice } = usePreferences();
  const {
    status,
    error,
    products,
    filters,
    sort,
    setSort,
    categoryCounts,
    activeFilterChips,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    toggleCategory,
    toggleColour,
    setPriceRange,
    setInStockOnly,
    setRatingFilter,
    setSearchQuery,
    clearAllFilters,
    reload,
  } = useMarketplace();

  const resultLabel = `${products.length} ${products.length === 1 ? 'product' : 'products'}`;

  useEffect(() => {
    if (!mobileFiltersOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileFiltersOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileFiltersOpen, setMobileFiltersOpen]);

  return (
    <div className="space-y-10 pb-16 sm:space-y-14">
      {/* Featured Campus Product Hero */}
      <SneakerProductHero />

      {/* Compact Verified Campus Strip */}
      <section
        aria-label="Campus Marketplace Highlights"
        className="flex flex-col justify-between gap-5 rounded-2xl border border-zinc-200 bg-stone-50/90 px-5 py-5 sm:px-7 lg:flex-row lg:items-center dark:border-zinc-800 dark:bg-zinc-900/60"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200">
            <UniCycleLogo className="h-4 w-4" />
            <span>Verified Campus Marketplace</span>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Buy and sell pre-owned furniture, electronics, kitchenware, and carry directly in your
            residence halls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-zinc-200/80 pt-4 lg:border-t-0 lg:pt-0 dark:border-zinc-800">
          <div>
            <p className="text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              2,840+
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Items Reused</p>
          </div>
          <div>
            <p className="text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatPrice(0)} Fee
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Hall Handover</p>
          </div>
          <div>
            <p className="inline-flex items-center gap-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
              100%
              <ShieldCheck className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">.edu / .ac.uk</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:ml-2">
            <Link
              to="/listings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-200/80 px-4 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-300/80 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Sell an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Main Shop Catalogue */}
      <section aria-label="Product Catalogue" className="space-y-8 sm:space-y-10">
        <div className="flex max-w-xl flex-col gap-2.5">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Shop
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            Everyday carry & hall essentials
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
            Furniture, kitchenware, bags, and small tech from verified campus sellers. Free
            residence hall pickup on every item.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Desktop Sticky Filter Sidebar */}
          <aside
            aria-label="Filters"
            className="hidden lg:sticky lg:top-24 lg:col-span-3 lg:block lg:self-start xl:col-span-2"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Filters</span>
              <button
                type="button"
                onClick={clearAllFilters}
                disabled={activeFilterChips.length === 0}
                className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Clear all
              </button>
            </div>
            <div className="pt-6">
              <FilterSidebar
                filters={filters}
                categoryCounts={categoryCounts}
                onToggleCategory={toggleCategory}
                onToggleColour={toggleColour}
                onPriceChange={setPriceRange}
                onToggleInStock={setInStockOnly}
                onSelectRating={setRatingFilter}
              />
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-9 xl:col-span-10">
            <div className="flex flex-col gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between gap-3 sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-800 lg:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                    {activeFilterChips.length > 0 ? (
                      <span className="tabular-nums">({activeFilterChips.length})</span>
                    ) : null}
                  </button>
                  <p
                    aria-live="polite"
                    className="text-sm tabular-nums text-zinc-600 dark:text-zinc-400"
                  >
                    {resultLabel}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-56">
                    <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      id="marketplace-search"
                      name="search"
                      type="search"
                      value={filters.searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search essentials..."
                      aria-label="Search essentials"
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-white pr-3 pl-8 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="relative w-full sm:w-48">
                    <select
                      id="marketplace-sort"
                      name="sort"
                      aria-label="Sort products"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortOptionValue)}
                      className="h-9 w-full appearance-none rounded-lg border border-zinc-200 bg-white py-1.5 pr-8 pl-3 text-xs font-medium text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                      {SORTS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-2.5 right-2.5 h-4 w-4 text-zinc-400" />
                  </div>
                </div>
              </div>

              {activeFilterChips.length > 0 ? (
                <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2">
                  {activeFilterChips.map((chip) => (
                    <li key={chip.key}>
                      <span className="inline-flex h-7 items-center gap-1 rounded-full border border-zinc-300 bg-white pr-1 pl-2.5 text-xs font-normal text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                        {chip.label}
                        <button
                          type="button"
                          aria-label={`Remove ${chip.label}`}
                          onClick={chip.onRemove}
                          className="grid h-5 w-5 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="px-2 text-xs text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      Clear all
                    </button>
                  </li>
                </ul>
              ) : null}
            </div>

            {status === 'loading' ? (
              <LoadingState label="Loading campus essentials catalogue..." />
            ) : null}

            {status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

            {status === 'empty' || (status === 'success' && products.length === 0) ? (
              <EmptyState
                title="Nothing matches those filters"
                description="Try a wider price range or fewer colours. Pre-owned student items come back in stock daily."
                actionLabel="Clear filters"
                onAction={clearAllFilters}
              />
            ) : null}

            {status === 'success' && products.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {products.map((product, index) => (
                  <ProductGridCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal Drawer */}
      {mobileFiltersOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          onClick={() => setMobileFiltersOpen(false)}
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs lg:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-dvh flex-col rounded-t-2xl border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Filters
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Results update as you change them.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <FilterSidebar
                filters={filters}
                categoryCounts={categoryCounts}
                onToggleCategory={toggleCategory}
                onToggleColour={toggleColour}
                onPriceChange={setPriceRange}
                onToggleInStock={setInStockOnly}
                onSelectRating={setRatingFilter}
              />
            </div>

            <div className="flex shrink-0 items-center gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <Button variant="outline" size="md" onClick={clearAllFilters} className="flex-1">
                Clear all
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1"
              >
                Show {products.length} results
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

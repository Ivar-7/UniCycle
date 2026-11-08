import {
  ArrowRight,
  Box,
  ChevronDown,
  Recycle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button, EmptyState, ErrorState, LoadingState, StudioCutoutSvg } from '@/shared/ui';
import { SORTS } from '../api/marketplace.api';
import type { SortOptionValue } from '../api/marketplace.types';
import { useMarketplace } from '../state/useMarketplace';
import { FilterSidebar } from './FilterSidebar';
import { ProductGridCard } from './ProductGridCard';

export function MarketplaceOverview() {
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

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Landing Hero with Lightweight 3D Preview */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-stone-100 via-white to-amber-50/50 px-6 py-12 shadow-xs dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-stone-900/60 sm:px-10 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-white/80 px-3.5 py-1 text-xs font-medium text-zinc-700 backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-300">
              <Recycle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>UniCycle · Student Pre-Owned Marketplace</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              Pre-owned essentials, curated for campus life.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Buy and sell high-quality pre-owned furniture, electronics, kitchenware, and everyday
              carry directly with verified students in your residence halls.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-102 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                <Box className="h-4 w-4" />
                Launch 3D Product Studio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Sell Pre-Owned Item
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-zinc-200/80 pt-6 dark:border-zinc-800">
              <div>
                <p className="text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                  2,840+
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Items Reused on Campus</p>
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                  $0 Fee
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Hall-to-Hall Handover</p>
              </div>
              <div>
                <p className="inline-flex items-center gap-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  100%
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Verified .edu / .ac.uk</p>
              </div>
            </div>
          </div>

          {/* Mini 3D Floating Preview Card linking to /products */}
          <div className="lg:col-span-5">
            <Link
              to="/products"
              className="group relative block overflow-hidden rounded-2xl border border-stone-300/80 bg-stone-900 p-6 text-stone-100 shadow-lg transition-transform hover:-translate-y-1 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Featured 3D Inspection</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-800 px-2.5 py-0.5 text-amber-300">
                  <Sparkles className="h-3 w-3" />
                  Interactive 3D
                </span>
              </div>

              <div className="relative my-4 flex h-44 items-center justify-center">
                <span className="pointer-events-none absolute text-6xl font-black tracking-tighter text-amber-500/20 uppercase select-none sm:text-7xl">
                  CLOUD
                </span>
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 h-36 w-full"
                >
                  <StudioCutoutSvg model="sneaker" palette="cloud" />
                </motion.div>
              </div>

              <div className="flex items-end justify-between border-t border-stone-800 pt-4">
                <div>
                  <p className="text-xs text-stone-400">Campus Athletics & Carry</p>
                  <p className="text-lg font-semibold text-white">Kestrel Vapor Pace 3</p>
                </div>
                <span className="text-sm font-semibold text-amber-400 group-hover:underline">
                  Open 3D View →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Ecommerce04 Shop Section (Matches image-1.png!) */}
      <section aria-label="Product Catalogue" className="space-y-10">
        {/* Category Header */}
        <div className="flex max-w-xl flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Shop
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            Everyday carry
          </h2>
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Bags, bottles, furniture, kitchenware and small tech we use every day. Free shipping
            over $200, free campus hall pickup, and free returns for 60 days.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Desktop Sticky Filter Sidebar */}
          <aside
            aria-label="Filters"
            className="hidden lg:sticky lg:top-24 lg:col-span-1 lg:block lg:self-start"
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
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-3">
            {/* Top Bar: Count, Search, Sort Dropdown, Active Chips */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 lg:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
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

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="search"
                      value={filters.searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search essentials..."
                      aria-label="Search essentials"
                      className="h-9 w-44 rounded-lg border border-zinc-200 bg-white pr-3 pl-8 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none sm:w-52 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="relative">
                    <select
                      aria-label="Sort products"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortOptionValue)}
                      className="h-9 min-w-44 appearance-none rounded-lg border border-zinc-200 bg-white py-1.5 pr-8 pl-3 text-xs font-medium text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
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

              {/* Active Filter Chips */}
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

            {/* States: Loading, Error, Empty, Success */}
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
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
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
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs lg:hidden"
        >
          <div className="max-h-screen overflow-y-auto rounded-t-2xl border-t border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
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

            <div className="py-6">
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

            <div className="flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAsyncState, type AsyncStatus } from '@/shared/hooks/useAsyncState';
import {
  CATEGORIES,
  COLOURS,
  fetchMarketplaceProducts,
  PRICE_MAX,
  PRICE_MIN,
  RATINGS,
} from '../api/marketplace.api';
import type {
  ActiveFilterChip,
  MarketplaceFilters,
  MarketplaceProduct,
  ProductCategory,
  ProductColour,
  RatingFilterValue,
  SortOptionValue,
} from '../api/marketplace.types';

const INITIAL_FILTERS: MarketplaceFilters = {
  categories: [],
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  colours: [],
  inStock: false,
  rating: 'any',
  searchQuery: '',
};

function matchesProduct(
  product: MarketplaceProduct,
  filters: MarketplaceFilters,
  ignoreCategory = false,
): boolean {
  const minRating = RATINGS.find((r) => r.value === filters.rating)?.min ?? 0;
  const categoryOk =
    ignoreCategory ||
    filters.categories.length === 0 ||
    filters.categories.includes(product.category);
  const priceOk = product.price >= filters.minPrice && product.price <= filters.maxPrice;
  const colourOk = filters.colours.length === 0 || filters.colours.includes(product.colour);
  const stockOk = !filters.inStock || product.inStock;
  const ratingOk = product.rating >= minRating;
  const query = filters.searchQuery.trim().toLowerCase();
  const searchOk =
    query === '' ||
    product.name.toLowerCase().includes(query) ||
    product.campusHall.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query);

  return categoryOk && priceOk && colourOk && stockOk && ratingOk && searchOk;
}

export function useMarketplace() {
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<MarketplaceProduct[]>(
    [],
    'loading',
  );
  const [filters, setFilters] = useState<MarketplaceFilters>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortOptionValue>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const loadProducts = useCallback(async () => {
    setLoading();
    try {
      const items = await fetchMarketplaceProducts();
      if (items.length === 0) {
        setEmpty();
      } else {
        setSuccess(items);
      }
    } catch (err: unknown) {
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const toggleCategory = useCallback((category: ProductCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const toggleColour = useCallback((colour: ProductColour) => {
    setFilters((prev) => ({
      ...prev,
      colours: prev.colours.includes(colour)
        ? prev.colours.filter((c) => c !== colour)
        : [...prev.colours, colour],
    }));
  }, []);

  const setPriceRange = useCallback((minPrice: number, maxPrice: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: Math.min(minPrice, maxPrice),
      maxPrice: Math.max(minPrice, maxPrice),
    }));
  }, []);

  const setInStockOnly = useCallback((inStock: boolean) => {
    setFilters((prev) => ({ ...prev, inStock }));
  }, []);

  const setRatingFilter = useCallback((rating: RatingFilterValue) => {
    setFilters((prev) => ({ ...prev, rating }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const allProducts = useMemo(() => state.data ?? [], [state.data]);

  const categoryCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      tech: 0,
      furniture: 0,
      kitchenware: 0,
      bags: 0,
      apparel: 0,
      outdoor: 0,
    };
    for (const product of allProducts) {
      if (matchesProduct(product, filters, true)) {
        counts[product.category] += 1;
      }
    }
    return counts;
  }, [allProducts, filters]);

  const filteredProducts = useMemo(() => {
    const matched = allProducts.filter((p) => matchesProduct(p, filters));
    const copy = [...matched];
    if (sort === 'price-asc') {
      copy.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      copy.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      copy.sort((a, b) => b.added.localeCompare(a.added));
    }
    return copy;
  }, [allProducts, filters, sort]);

  const activeFilterChips = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];

    for (const cat of filters.categories) {
      const label = CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
      chips.push({
        key: `cat-${cat}`,
        label,
        onRemove: () => toggleCategory(cat),
      });
    }

    if (filters.minPrice !== PRICE_MIN || filters.maxPrice !== PRICE_MAX) {
      chips.push({
        key: 'price',
        label: `$${filters.minPrice} to $${filters.maxPrice}`,
        onRemove: () => setPriceRange(PRICE_MIN, PRICE_MAX),
      });
    }

    for (const col of filters.colours) {
      const label = COLOURS.find((c) => c.value === col)?.label ?? col;
      chips.push({
        key: `col-${col}`,
        label,
        onRemove: () => toggleColour(col),
      });
    }

    if (filters.inStock) {
      chips.push({
        key: 'stock',
        label: 'In stock',
        onRemove: () => setInStockOnly(false),
      });
    }

    if (filters.rating !== 'any') {
      const label = RATINGS.find((r) => r.value === filters.rating)?.label ?? filters.rating;
      chips.push({
        key: 'rating',
        label,
        onRemove: () => setRatingFilter('any'),
      });
    }

    if (filters.searchQuery.trim() !== '') {
      chips.push({
        key: 'search',
        label: `"${filters.searchQuery.trim()}"`,
        onRemove: () => setSearchQuery(''),
      });
    }

    return chips;
  }, [
    filters,
    setInStockOnly,
    setPriceRange,
    setRatingFilter,
    setSearchQuery,
    toggleCategory,
    toggleColour,
  ]);

  const simulateStatus = useCallback(
    (status: AsyncStatus) => {
      if (status === 'loading') {
        setLoading();
      } else if (status === 'empty') {
        setEmpty();
      } else if (status === 'error') {
        setError(new Error('Simulated catalogue error'));
      } else {
        void loadProducts();
      }
    },
    [loadProducts, setEmpty, setError, setLoading],
  );

  return {
    status: state.status,
    error: state.error,
    products: filteredProducts,
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
    reload: loadProducts,
    simulateStatus,
  };
}

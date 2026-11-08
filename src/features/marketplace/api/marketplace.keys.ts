import type { ProductCategory } from './marketplace.types';

export const marketplaceKeys = {
  all: ['marketplace'] as const,
  lists: () => [...marketplaceKeys.all, 'list'] as const,
  listByCategory: (category: ProductCategory) =>
    [...marketplaceKeys.lists(), { category }] as const,
};

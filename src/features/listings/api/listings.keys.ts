export const listingsKeys = {
  all: ['listings'] as const,
  seller: (sellerId: string) => [...listingsKeys.all, 'seller', sellerId] as const,
  detail: (listingId: string) => [...listingsKeys.all, 'detail', listingId] as const,
};

export const wishlistKeys = {
  all: ['wishlist'] as const,
  byUser: (userId: string) => [...wishlistKeys.all, userId] as const,
};

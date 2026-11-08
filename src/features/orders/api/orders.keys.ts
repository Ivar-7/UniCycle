export const ordersKeys = {
  all: ['orders'] as const,
  byBuyer: (buyerId: string) => [...ordersKeys.all, 'buyer', buyerId] as const,
};

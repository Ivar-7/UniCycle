import { z } from 'zod';

export const sellerListingSchema = z.object({
  id: z.string().min(1),
  sellerId: z.string().min(1),
  title: z.string().min(2, 'Item title must be at least 2 characters').max(140),
  category: z.enum(['tech', 'bags', 'apparel', 'outdoor', 'furniture', 'kitchenware']),
  price: z.number().positive().max(50000),
  status: z.enum(['active', 'reserved', 'sold']),
  viewsCount: z.number().int().nonnegative(),
  pickupHall: z.string().min(2).max(120),
  imageUrl: z.string().min(5).max(2048),
  storageSource: z.enum(['firebase-storage', 'seed']).optional(),
  updatedAt: z.string().min(1),
});

export const createListingInputSchema = z.object({
  title: z.string().min(2, 'Enter an item name (at least 2 characters)').max(140),
  category: z.enum(['tech', 'bags', 'apparel', 'outdoor', 'furniture', 'kitchenware']),
  price: z.number().positive('Price must be greater than 0').max(50000, 'Price is too high'),
  pickupHall: z.string().min(2, 'Specify a campus pickup hall').max(120),
});

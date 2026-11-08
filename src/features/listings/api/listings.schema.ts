import { z } from 'zod';

export const sellerListingSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2, 'Item title must be at least 2 characters'),
  category: z.enum(['tech', 'bags', 'apparel', 'outdoor', 'furniture', 'kitchenware']),
  price: z.number().nonnegative(),
  status: z.enum(['active', 'reserved', 'sold']),
  viewsCount: z.number().int().nonnegative(),
  pickupHall: z.string().min(2),
  imageUrl: z.string().min(5),
  storageSource: z.enum(['firebase-storage', 'local-preview', 'seed']).optional(),
  updatedAt: z.string().min(1),
});

export const sellerListingListSchema = z.array(sellerListingSchema);

export const createListingInputSchema = z.object({
  title: z.string().min(2, 'Enter an item name (at least 2 characters)'),
  category: z.enum(['tech', 'bags', 'apparel', 'outdoor', 'furniture', 'kitchenware']),
  price: z.number().positive('Price must be greater than $0'),
  pickupHall: z.string().min(2, 'Specify a campus pickup hall'),
});

import { z } from 'zod';

export const wishlistEntrySchema = z.object({
  id: z.string().min(1),
  listingId: z.string().min(1),
  title: z.string().min(2),
  price: z.number().nonnegative(),
  campusLocation: z.string().min(1),
  inStock: z.boolean(),
  savedAt: z.string().min(1),
});

export const wishlistEntryListSchema = z.array(wishlistEntrySchema);

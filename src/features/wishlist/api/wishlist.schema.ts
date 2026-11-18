import { z } from 'zod';

export const wishlistEntrySchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  listingId: z.string().min(1),
  title: z.string().min(2).max(160),
  price: z.number().nonnegative().max(1000000),
  campusLocation: z.string().min(1).max(120),
  sellerId: z.string().min(1).optional(),
  sellerName: z.string().min(1).max(120).optional(),
  inStock: z.boolean(),
  savedAt: z.string().min(1),
});

export const wishlistEntryListSchema = z.array(wishlistEntrySchema);

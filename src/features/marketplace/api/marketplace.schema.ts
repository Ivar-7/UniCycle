import { z } from 'zod';

export const marketplaceProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  category: z.enum(['tech', 'bags', 'apparel', 'outdoor', 'furniture', 'kitchenware']),
  colour: z.enum(['black', 'white', 'sand', 'olive', 'navy']),
  price: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().nonnegative(),
  inStock: z.boolean(),
  added: z.string().min(1),
  image: z.string().min(5),
  campusHall: z.string().min(1),
  sellerName: z.string().min(1),
  condition: z.enum(['Like new', 'Good', 'Mint']),
  showcaseId: z.string().min(1),
});

export const marketplaceProductListSchema = z.array(marketplaceProductSchema);

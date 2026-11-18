import { z } from 'zod';

export const studentOrderSchema = z.object({
  id: z.string().min(1),
  buyerId: z.string().min(1),
  sellerId: z.string().min(1).optional(),
  itemTitle: z.string().min(1).max(200),
  totalAmount: z.number().nonnegative().max(1000000),
  sellerName: z.string().min(1).max(120),
  meetupSpot: z.string().min(1).max(120),
  status: z.enum(['scheduled-pickup', 'completed', 'cancelled']),
  pickupCode: z.string().min(4).max(20),
  orderedAt: z.string().min(1),
});

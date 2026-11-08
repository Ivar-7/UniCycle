import { z } from 'zod';

export const studentOrderSchema = z.object({
  id: z.string().min(1),
  itemTitle: z.string().min(1),
  totalAmount: z.number().nonnegative(),
  sellerName: z.string().min(1),
  meetupSpot: z.string().min(1),
  status: z.enum(['scheduled-pickup', 'completed', 'cancelled']),
  pickupCode: z.string().min(4),
  orderedAt: z.string().min(1),
});

export const studentOrderListSchema = z.array(studentOrderSchema);

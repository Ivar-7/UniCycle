import { z } from 'zod';

export const studentProfileSchema = z.object({
  id: z.string().min(1),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  universityEmail: z.string().email(),
  universityName: z.string().min(2),
  residenceHall: z.string().min(2, 'Residence hall is required'),
  isVerifiedStudent: z.boolean(),
  itemsReusedCount: z.number().int().nonnegative(),
  wasteDivertedKg: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  avatarUrl: z.string().optional(),
});

export const updateProfileInputSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  residenceHall: z.string().trim().min(2, 'Residence hall is required'),
});

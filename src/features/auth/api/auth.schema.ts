import { z } from 'zod';

export const studentSignInSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const studentRegisterSchema = studentSignInSchema.extend({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100),
});

export const authSessionSummarySchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  verifiedCampusDomain: z.boolean(),
});

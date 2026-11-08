import { z } from 'zod';

export const studentSignInSchema = z.object({
  universityEmail: z
    .string()
    .trim()
    .email('Enter a valid university email address')
    .refine(
      (email) => email.endsWith('.ac.uk') || email.endsWith('.edu'),
      'Must be an academic university email (.ac.uk or .edu)',
    ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const studentRegisterSchema = studentSignInSchema.extend({
  fullName: z.string().trim().min(2, 'Enter your full student name'),
  residenceHall: z.string().trim().min(2, 'Select or enter your residence hall'),
});

export const authSessionSummarySchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  residenceHall: z.string().min(1),
  verifiedCampusDomain: z.boolean(),
  authProvider: z.enum(['firebase', 'campus-seed']),
});

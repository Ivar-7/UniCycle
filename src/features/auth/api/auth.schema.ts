import { z } from 'zod';

export const studentSignInSchema = z.object({
  universityEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email('Enter a valid university email address')
    .refine(
      (email) => email.endsWith('.ac.uk') || email.endsWith('.edu'),
      'Must be an academic university email (.ac.uk or .edu)',
    ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const studentRegisterSchema = studentSignInSchema.extend({
  fullName: z.string().trim().min(2, 'Enter your full student name').max(100),
  residenceHall: z.string().trim().min(2, 'Select or enter your residence hall').max(120),
});

export const authSessionSummarySchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  verifiedCampusDomain: z.boolean(),
});

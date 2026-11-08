import { z } from 'zod';

export const firebaseConfigSchema = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  databaseURL: z.string().url(),
  projectId: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
  appId: z.string().min(1),
  measurementId: z.string().optional(),
});

export type FirebaseConfig = z.infer<typeof firebaseConfigSchema>;

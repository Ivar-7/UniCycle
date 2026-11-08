import { z } from 'zod';

export const studentSettingsSchema = z.object({
  defaultCampusHall: z.string().min(2),
  priceDropAlerts: z.boolean(),
  instantMessageAlerts: z.boolean(),
  pickupReminders: z.boolean(),
  showVerifiedBadgePublicly: z.boolean(),
  ecoImpactPublic: z.boolean(),
  preferredCurrency: z.enum(['USD', 'GBP', 'EUR']),
});

import { z } from 'zod';

export const impactMetricSchema = z.object({
  id: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
});

export const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const aboutOverviewSchema = z.object({
  metrics: z.array(impactMetricSchema),
  faqs: z.array(faqItemSchema),
});

import { z } from 'zod';

export const showcaseVariantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  palette: z.enum(['cloud', 'onyx', 'cobalt', 'olive', 'sand']),
  swatchClass: z.string().min(1),
  stageRadialDarkClass: z.string().min(1),
  stageRadialLightClass: z.string().min(1),
  watermarkClass: z.string().min(1),
  soldOutSizes: z.array(z.string()),
});

export const showcaseSizeOptionSchema = z.object({
  label: z.string().min(1),
  price: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  soldOut: z.boolean().optional(),
});

export const showcaseAngleViewSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  scaleClass: z.string().min(1),
  mirror: z.boolean(),
});

export const showcaseProductSchema = z.object({
  id: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  model: z.enum([
    'sneaker',
    'headphones',
    'lamp',
    'kettle',
    'chair',
    'camera',
    'backpack',
    'watch',
    'bottle',
    'sunglasses',
    'cookware',
    'cap',
  ]),
  sizeLabelHeader: z.string().min(1),
  defaultVariantIndex: z.number().int().nonnegative(),
  variants: z.array(showcaseVariantSchema).min(1),
  sizes: z.array(showcaseSizeOptionSchema).min(1),
  angles: z.array(showcaseAngleViewSchema).min(1),
  sellerName: z.string().min(1),
  campusHall: z.string().min(1),
  conditionNote: z.string().min(1),
});

export const showcaseProductListSchema = z.array(showcaseProductSchema);

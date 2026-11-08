# Listings Feature

## Purpose
Allows university students to list pre-owned household items for sale, track views, update listing availability, and coordinate campus hall collection points.

## Structure
- `api/` — Types, Zod validation schemas, query keys, and listing API methods (`listings.api.ts`, `listings.keys.ts`, `listings.schema.ts`, `listings.types.ts`).
- `state/` — Hook for seller listings and local interaction state (`useListings.ts`).
- `components/` — Seller listings placeholder view (`ListingsPlaceholder.tsx`).
- `pages/` — Route composition page (`ListingsPage.tsx`).

# Marketplace Feature

## Purpose
Enables university students to browse, search, and filter affordable pre-owned household essentials across campus categories such as Furniture, Electronics, Kitchenware, and Study Gear.

## Structure
- `api/` — Types, Zod schemas, query keys, and Firestore/mock API methods (`marketplace.api.ts`, `marketplace.keys.ts`, `marketplace.schema.ts`, `marketplace.types.ts`).
- `state/` — Remote data & filter interaction hook (`useMarketplace.ts`).
- `components/` — Marketplace catalog placeholder view (`MarketplaceOverview.tsx`).
- `pages/` — Route composition page (`MarketplacePage.tsx`).

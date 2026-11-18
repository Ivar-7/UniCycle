# Marketplace Feature

## Purpose
Enables university students to browse, search, and filter affordable pre-owned household essentials across campus categories such as Furniture, Electronics, Kitchenware, and Study Gear.

## Structure
- `api/` — Types, Zod schemas, query keys, and Firestore catalogue methods (`marketplace.api.ts`, `marketplace.keys.ts`, `marketplace.schema.ts`, `marketplace.types.ts`).
- `state/` — Remote data & filter interaction hooks (`useMarketplace.ts`, `useMarketplaceItem.ts`).
- `components/` — Featured floating product hero (`SneakerProductHero.tsx`), catalogue overview (`MarketplaceOverview.tsx`), filter sidebar (`FilterSidebar.tsx`), product cards (`ProductGridCard.tsx`), and item detail view (`ItemDetailView.tsx`).
- `pages/` — Route composition pages (`MarketplacePage.tsx`, `ItemDetailPage.tsx`).

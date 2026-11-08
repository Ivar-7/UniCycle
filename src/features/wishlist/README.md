# Wishlist Feature

## Purpose
Enables students to bookmark pre-owned household essentials and track price reductions before moving into university accommodation.

## Structure
- `api/` — Types, Zod schemas, query keys, and wishlist API methods (`wishlist.api.ts`, `wishlist.keys.ts`, `wishlist.schema.ts`, `wishlist.types.ts`).
- `state/` — Hook for saved items and state simulation (`useWishlist.ts`).
- `components/` — Wishlist placeholder view (`WishlistPlaceholder.tsx`).
- `pages/` — Route composition page (`WishlistPage.tsx`).

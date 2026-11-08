# Orders Feature

## Purpose
Tracks student purchases, campus handover schedules, and completed pre-owned household item exchanges.

## Structure
- `api/` — Types, Zod schemas, query keys, and order API methods (`orders.api.ts`, `orders.keys.ts`, `orders.schema.ts`, `orders.types.ts`).
- `state/` — Hook for order history and state transitions (`useOrders.ts`).
- `components/` — Orders & campus exchanges placeholder view (`OrdersPlaceholder.tsx`).
- `pages/` — Route composition page (`OrdersPage.tsx`).

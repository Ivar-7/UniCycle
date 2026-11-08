# Messages Feature

## Purpose
Provides real-time messaging between student buyers and sellers to arrange safe on-campus handovers and inspect pre-owned household essentials.

## Structure
- `api/` — Types, Zod schemas, query keys, and messaging API methods (`messages.api.ts`, `messages.keys.ts`, `messages.schema.ts`, `messages.types.ts`).
- `state/` — Hook for student conversation threads (`useMessages.ts`).
- `components/` — Campus inbox placeholder view (`MessagesPlaceholder.tsx`).
- `pages/` — Route composition page (`MessagesPage.tsx`).

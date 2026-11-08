# Profile Feature

## Purpose
Displays a student's verified university profile, accommodation hall, seller reputation, and sustainability impact metrics (kilograms of household waste diverted from landfill).

## Structure
- `api/` — Types, Zod schemas, query keys, and profile API methods (`profile.api.ts`, `profile.keys.ts`, `profile.schema.ts`, `profile.types.ts`).
- `state/` — Hook for student profile state (`useProfile.ts`).
- `components/` — Student profile & sustainability impact placeholder (`ProfilePlaceholder.tsx`).
- `pages/` — Route composition page (`ProfilePage.tsx`).

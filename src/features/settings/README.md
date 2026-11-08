# Settings Feature

## Purpose
Allows students to customize their UniCycle experience, including Light/Dark theme appearance, default campus pickup hall, notification preferences, and privacy controls.

## Structure
- `api/` — Types, Zod schemas, query keys, and settings persistence helpers (`settings.api.ts`, `settings.keys.ts`, `settings.schema.ts`, `settings.types.ts`).
- `state/` — Hook for managing student preferences (`useSettings.ts`).
- `components/` — Editorial settings interface (`SettingsView.tsx`).
- `pages/` — Route composition page (`SettingsPage.tsx`).

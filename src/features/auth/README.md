# Auth Feature

## Purpose
Handles university student authentication, `.ac.uk` / `.edu` campus email validation at the form boundary, and Firebase Auth session status.

## Structure
- `api/` — Types, Zod form validation schema, query keys, and Firebase auth wrapper methods (`auth.api.ts`, `auth.keys.ts`, `auth.schema.ts`, `auth.types.ts`).
- `state/` — Hook for student login form validation and auth status (`useStudentAuth.ts`).
- `components/` — Campus authentication placeholder card (`AuthPlaceholder.tsx`).
- `pages/` — Route composition page (`AuthPage.tsx`).

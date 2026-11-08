# 3D Product Showcase Feature

## Purpose
Provides an interactive, lightweight 3D product inspection studio (recreating `SneakerProductHero` from `image.png`) with pointer-driven 3D tilt, floating levitation, floor reflection, colourway transitions, dynamic size pricing, and a multi-angle zoom gallery.

## Structure
- `api/` — Types, Zod schemas, query keys, and showcase product catalogue (`showcase.api.ts`, `showcase.keys.ts`, `showcase.schema.ts`, `showcase.types.ts`).
- `state/` — Hook for active product, colourway variant, size, cart state, and gallery viewer (`useShowcase.ts`).
- `components/` — 3D stage (`StudioStage3D.tsx`), fullscreen angle viewer (`ShowcaseGalleryModal.tsx`), and full showcase layout (`ProductShowcaseView.tsx`).
- `pages/` — Route composition page (`ProductShowcasePage.tsx`).

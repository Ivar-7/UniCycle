# UniCycle

**A Student-Centred Digital Marketplace for Pre-Owned Household Essentials**

UniCycle is a web-based student marketplace where university students buy and sell affordable pre-owned household items such as furniture, electronics, kitchenware, appliances, and study gear.

## Architecture

- **`src/app/`** — Application providers (`AppProvider`, `AuthProvider`, `ThemeProvider`), root layout (`RootLayout`), and lazy-loaded route definitions (`router.tsx`).
- **`src/features/`** — Domain features with isolated `pages/`, `components/`, `state/`, `api/`, and feature `README.md`:
  - `marketplace` (`/`) — Browse, search, filter, and sort pre-owned student household essentials (`Ecommerce04` editorial storefront).
  - `showcase` (`/products`) — Interactive 3D Studio Product Showcase (`SneakerProductHero` studio experience with 12 custom vector models, 3D tilt, colourway/size selectors, and gallery modal).
  - `listings` (`/listings`) — Create and manage student seller listings with Firebase Storage image upload and campus hall pickup locations.
  - `wishlist` (`/wishlist`) — Saved pre-owned items, price-drop alerts, and instant campus pickup reservation.
  - `orders` (`/orders`) — Campus meetup exchanges, handover codes, and order completion tracking.
  - `messages` (`/messages`) — Student-to-student campus handover messaging and quick hall meetup chips.
  - `profile` (`/profile`) — Verified student profile, avatar photo upload via Firebase Storage, accommodation hall, and circular reuse impact.
  - `settings` (`/settings`) — Light (default) & Dark studio theme switcher, campus pickup preferences, notification toggles, and Firebase seed reset.
  - `about` (`/about`) — Circular campus economy mission, verified handover workflow, and FAQs.
  - `auth` (`/auth`) — Academic email (`.ac.uk` / `.edu`) authentication powered by Firebase Auth.
- **`src/shared/`** — Normalized global error handling (`src/shared/errors/`), Firebase SDK initialization, Firestore seed engine, and Firebase Storage uploader (`src/shared/firebase/`), reusable UI (`src/shared/ui/`), hooks (`src/shared/hooks/`), and utilities (`src/shared/utils/`).

## Scripts

- `npm run dev` — Start Vite development server
- `npm run format` — Format codebase with Prettier
- `npm run lint` — Run ESLint checks
- `npm run typecheck` — Run TypeScript strict typecheck
- `npm run build` — Build production bundle

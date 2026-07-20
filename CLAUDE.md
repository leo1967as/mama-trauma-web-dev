# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo structure

This is a **monorepo** with two independent React+Vite apps sharing the same git root:

| Directory | App | Purpose |
|-----------|-----|---------|
| `/` (root) | **Afterbloom** | Patient-facing mobile web app for postpartum mothers |
| `Admin-Dashboard/` | **Admin Dashboard** | Clinic-side care team dashboard (Thai hospital coordinators) |

Each app has its own `package.json`, `vite.config.js`, and `node_modules`. Run commands from the correct directory.

---

## Commands

### Afterbloom (run from repo root `/`)
```bash
npm run dev          # dev server (localhost:5173)
npm run build        # production build
npm run lint         # eslint --quiet
npm run lint:fix     # auto-fix lint errors
npm run typecheck    # tsc type-check (no emit)
npm run preview      # preview production build
```

### Admin Dashboard (run from `Admin-Dashboard/`)
```bash
npm run dev
npm run build
npm run lint
npm run lint:fix
npm run typecheck
npm run preview
```

The Admin Dashboard connects to Firebase directly — config is hardcoded in `Admin-Dashboard/src/lib/firebase.js` (no `.env.local` required).

---

## Afterbloom architecture

Single-page app. The only route is `/` → `Dashboard.jsx`, which acts as a shell managing all overlays and tabs.

**Tab system** (`src/pages/Dashboard.jsx`):
- Active tab rendered via `AnimatePresence`/`Suspense`
- Tabs: `home`, `mood`, `therapy`, `careplans`, `circle`, `legacy` (hidden — unlocked by typing "ADMIN" or 5-tap on header)
- All secondary tabs and flows are **lazy-loaded** via `React.lazy`. On idle after 3.5s they are all preloaded in background.
- `BottomNav` is hidden while `CheckInFlow`, `EpdsFlow`, or the help overlay is open

**Overlays** (rendered via `createPortal` to `document.body`):
- `CheckInFlow` — daily check-in questionnaire
- `EpdsFlow` — Edinburgh Postnatal Depression Scale (10-question scored)
- "I Need Help" (`SafetySection`) — crisis/safety resources, always accessible, focus-trapped, logged every open

**Data layer — localStorage for app state, Firebase/Firestore for cross-app sync:**
- `src/lib/firebase-sync.js` pushes profile, check-in, EPDS score, safety-log-access, and journal events to Firestore (`mothers/{uid}` doc + `checkins`, `epds_scores`, `safety_log` subcollections) so the Admin Dashboard (clinic side) can read them. All local features still read/write localStorage as primary storage; Firestore sync is additive, one-way (Afterbloom → Admin Dashboard).
- `src/lib/user-data.js` — onboarding state, baby birth date, postpartum STAGES, day label, display name
- `src/lib/mood-data.js` — mood history, check-in drafts, safety access log, SUPPORT_LEVELS thresholds
- `src/lib/epds-data.js` — EPDS scoring (10-question, reverse-scored on questions 2,4–9), support level thresholds
- `src/lib/support-episode.js` — support episode suppression logic

**Design system:**
- `src/lib/theme.jsx` — **single source of truth** for design tokens. Import `COLORS`, `LAYERS`, `LAYOUT`, `EASE_OUT_QUINT`, `HERO_THEMES` from here. Also exports shared primitives: `Card`, `PrimaryButton`, `TabHero`, `TabSheet`, `Skeleton`.
- CSS variables in `src/index.css` back Tailwind semantic tokens (`background`, `foreground`, `primary`, `calm.*`, etc.)
- Brand fonts: `font-body` (Plus Jakarta Sans), `font-nunito` via CSS variables
- Paper background: `#FBF6F0`; brand rose accent: `#AF636A`

**Vite build** splits vendors into named chunks: `charts` (recharts+d3), `motion`, `radix`, `router`, `react`, `query`, `icons`, `vendor`. Vercel Analytics + SpeedInsights are deferred to idle in prod only.

---

## Admin Dashboard architecture

Backend-connected app that reads/writes Firestore directly via `src/lib/firestore.js` and `src/lib/firebase.js` (config hardcoded, no env vars). `src/hooks/useFirestoreData.js` wraps `firestore.js` in React hooks (`useMothers`, `useMother`, `useCheckins`, `useEpdsScores`, `useCaseNotes`, `useDashboardStats`) and normalizes raw Firestore docs (postpartum stage/day derivation, support-level resolution, alert flags).

**Auth flow** (`src/lib/AuthContext.jsx`): a hardcoded `admin`/`admin` credential check that sets an `isAuthenticated` flag in localStorage — no real backend auth, no Base44.

**Data access pattern**: `firestore.js` exports plain async functions (`getMothers`, `getMother`, `getCheckins`, `addCheckin`, `getEpdsScores`, `addEpdsScore`, `getCaseNotes`, `addCaseNote`, `updateCaseStatus`, `getDashboardStats`, etc.) plus `subscribeMothers`/`subscribeCaseNotes` real-time listeners. `resolveSupportLevel(data)` is the dual-read helper that normalizes the legacy 3-tier `riskLevel` field (from older documents) into the current 4-tier `supportLevel` (`steady`/`gentle`/`extra`/`immediate`).

**Page layout**: `AppLayout` wraps all routes with `Sidebar` + `TopBar`. Pages import feature components from `src/components/dashboard/`, `src/components/detail/`, and `src/components/shared/`.

**Mock data**: `src/lib/mockData.js` provides Thai-language hospital/patient fixtures, used by `src/lib/seedFirestore.js` to seed a dev Firestore instance — not used as a runtime data source (the live app reads Firestore via the hooks above).

---

## Shared conventions (both apps)

- **`@` alias** → `./src` in both apps (configured in `vite.config.js` and `jsconfig.json`)
- **shadcn/ui** components live in `src/components/ui/` — do not modify these; treat them as library code. ESLint and `tsc` both exclude `src/components/ui/`.
- **ESLint** (root app) only covers `src/components/**` and `src/pages/**` — `src/lib/` and `src/components/ui/` are excluded.
- **`typecheck`** (`tsc --noEmit`) covers `src/components/**` and `src/pages/**` only (same exclusions as lint).
- **No test suite** — no Jest/Vitest/Playwright tests exist in either app.
- Tailwind uses CSS variables for all semantic colors. Never hardcode hex values in Tailwind classes; use the token names (`bg-background`, `text-foreground`, `border-border`, `text-calm-green`, etc.).

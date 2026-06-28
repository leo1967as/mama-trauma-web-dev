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

The Admin Dashboard requires `Admin-Dashboard/.env.local`:
```
VITE_BASE44_APP_ID=<app_id>
VITE_BASE44_APP_BASE_URL=<backend_url>
```

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

**Data layer — all localStorage, no backend:**
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

Backend-connected app using the **Base44 SDK** (`@base44/sdk`). The `db` object from `src/api/base44Client.js` is injected at runtime by `@base44/vite-plugin` — the exported stub in that file is only a build-time placeholder.

**Auth flow** (`src/lib/AuthContext.jsx`):
1. Fetch app public settings via `/api/apps/public/prod/public-settings/by-id/{appId}`
2. If a token exists, call `db.auth.me()` to hydrate user
3. `authError.type` can be `'auth_required'` (redirect to login) or `'user_not_registered'` (show error screen)

**Data access pattern**: `db.entities.<EntityName>.filter(...)` / `.get(id)` / `.create(data)` / `.update(id, data)` / `.delete(id)`. All async.

**Page layout**: `AppLayout` wraps all routes with `Sidebar` + `TopBar`. Pages import feature components from `src/components/dashboard/`, `src/components/detail/`, and `src/components/shared/`.

**Mock data**: `src/lib/mockData.js` provides Thai-language hospital/patient fixtures for local dev without a live backend.

---

## Shared conventions (both apps)

- **`@` alias** → `./src` in both apps (configured in `vite.config.js` and `jsconfig.json`)
- **shadcn/ui** components live in `src/components/ui/` — do not modify these; treat them as library code. ESLint and `tsc` both exclude `src/components/ui/`.
- **ESLint** (root app) only covers `src/components/**` and `src/pages/**` — `src/lib/` and `src/components/ui/` are excluded.
- **`typecheck`** (`tsc --noEmit`) covers `src/components/**` and `src/pages/**` only (same exclusions as lint).
- **No test suite** — no Jest/Vitest/Playwright tests exist in either app.
- Tailwind uses CSS variables for all semantic colors. Never hardcode hex values in Tailwind classes; use the token names (`bg-background`, `text-foreground`, `border-border`, `text-calm-green`, etc.).

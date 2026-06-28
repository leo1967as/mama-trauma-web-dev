## 2026-05-21 — Replace vendor dependency with standalone local app
- Context: The project still contained Base44 stubs, config, and assumptions that blocked treating it as a product-owned app.
- Decision: Remove vendor-specific runtime dependencies and run the app as a standalone local React/Vite application.
- Alternatives considered: keep the vendor layer temporarily while patching around it.
- Rationale: A clean local runtime is easier to reason about, document, and extend for real product behavior.
- Revisit if: a real backend or platform integration is introduced later.

## 2026-05-21 — Keep Mood task-first and move displaced modules into Legacy
- Context: The main Mood screen had become a dense dashboard mixing quick check-in, journal, detailed analytics, and support content in one flow.
- Decision: Keep Mood focused on the daily check-in task, place graph and one key insight after save, and move journal plus older supporting modules into the temporary Legacy tab.
- Alternatives considered: keep everything on Mood with better spacing, or split the displaced sections into permanent tabs immediately.
- Rationale: A postpartum user needs one obvious action first; Legacy preserves moved work without losing it during the refactor.
- Revisit if: permanent destinations for journal, insights, and support tools are approved.

## 2026-06-08 — Afterbloom rebrand and single help shell
- Context: The user asked for a full MaMa -> Afterbloom rebrand, support-level terminology, and `I Need Help` on every screen.
- Decision: Rename the component folder to `afterbloom`, switch UI copy/storage to Afterbloom namespaces, and expose one global help sheet from `Dashboard` instead of duplicating safety UI in each flow.
- Alternatives considered: keep the old folder name and only change visible copy, or keep separate help entry points in each feature.
- Rationale: One consistent help surface and one brand namespace reduce drift and make the app easier to reason about.
- Revisit if: browser QA shows the help sheet should be presented differently or the support thresholds need recalibration.

## 2026-06-15 — Treat Afterbloom as a warm, private, steady product UI
- Context: The repo had already been rebranded to Afterbloom, but it still lacked a root product/design contract for future UI work and `impeccable` flows.
- Decision: Define Afterbloom as a product-first postpartum support app, not a landing surface, and encode its design language in `PRODUCT.md`, `DESIGN.md`, and `.impeccable/design.json`.
- Alternatives considered: leave the direction implicit in component code only, or treat the app more like a brand/marketing surface.
- Rationale: A durable product/design contract reduces drift, keeps future UI passes aligned, and protects the app from sliding into period-tracker or childish wellness patterns.
- Revisit if: the product adds a separate marketing site, expands beyond the current postpartum-care workflow, or the implemented UI diverges enough that the design spec no longer reflects reality.

## 2026-06-15 — Centralize mobile bottom-nav spacing and overlay layers
- Context: BottomNav is fixed globally and could cover bottom CTAs in small-screen full-screen flows, especially nested booking inside Therapy.
- Decision: Add shared `LAYOUT` and `LAYERS` tokens, reserve bottom-nav space in Dashboard, hide Dashboard-owned nav during full-screen flows, and move flow overlays above the nav with safe bottom padding.
- Alternatives considered: add per-button margin hacks, only raise BookingFlow z-index, or always hide BottomNav globally.
- Rationale: Central tokens prevent repeated magic numbers and keep Booking, Check-in, and EPDS CTAs reachable across small mobile screens.
- Revisit if: the app shell changes nav height, adds route-level modals/drawers, or adopts a portal/dialog layer manager.
## 2026-06-27 — Prioritize working prototype workflow before security hardening
- Context: The next validation requires a mother action in Afterbloom to appear and be handled correctly in the Hospital Dashboard.
- Decision: Implement the end-to-end Check-in/EPDS/Help case workflow now and defer authentication, RBAC, and Firestore security hardening.
- Alternatives considered: Implement security first; keep the Dashboard as visual-only mock screens.
- Rationale: A functioning tracer workflow is required for product validation, while all test data can remain synthetic during this phase.
- Revisit if: Any identifiable patient data is introduced or the prototype is exposed beyond controlled validation.
## 2026-06-27 — Use Google identity with a prototype guest device ID
- Context: Firebase Google Auth was enabled, but Anonymous Auth was disabled and app startup treated anonymous signup as mandatory.
- Decision: Restore/use the Google Firebase UID when signed in; otherwise use a stable local device ID for guest prototype sync without calling Anonymous Auth.
- Alternatives considered: Enable Anonymous Auth; require Google login before any app use; leave the failing anonymous fallback.
- Rationale: Google login remains available while guest validation works without an unnecessary provider or uncaught startup failure.
- Revisit if: Firestore rules begin requiring authenticated writes, guest data must sync across devices, or accounts need linking/migration.

## 2026-06-27 — Separate unassessed, missing-data, and case states explicitly
- Context: Fresh Mother App profiles were being normalized into low-risk/complete-looking Admin records even before any assessment existed, while many cards hid themselves or used ambiguous placeholders like `—` and `ไม่มีข้อมูล`.
- Decision: Introduce explicit `assessmentState`, `caseStatus`, and `caseSource` semantics, start new profiles as `unassessed` + `none`, and render field-specific empty states such as `ยังไม่เก็บจากคุณแม่`, `รอทีมดูแลกรอก`, and `ยังไม่เก็บวันคลอด` instead of generic blanks.
- Alternatives considered: Keep using `riskLevel=low` as the default fallback; add richer hospital fields immediately instead of clarifying state semantics first; hide empty cards until data exists.
- Rationale: Product validation depends on operational clarity more than completeness; staff must be able to tell the difference between "no clinical signal yet", "mother has not entered this", and "hospital has not filled this in".
- Revisit if: clinical advisors redefine the assessment lifecycle, or the hospital dashboard gains a separate staff-owned data-entry surface that changes which fields belong to mother vs. staff.

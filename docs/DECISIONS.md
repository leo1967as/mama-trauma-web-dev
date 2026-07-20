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

## 2026-07-14 — Write snake_case and dual-read legacy check-in fields
- Context: Mother App local records and older Firestore documents use camelCase, while the approved developer brief defines snake_case fields consumed by Admin.
- Decision: Write new Firestore profile, check-in, EPDS, safety, and goal fields in snake_case; keep Mother and Admin readers compatible with both forms.
- Alternatives considered: migrate every existing document immediately; keep writing camelCase and translate only in Admin.
- Rationale: New data follows the product contract without breaking existing prototype records or requiring a risky bulk migration.
- Revisit if: all legacy records are migrated and compatibility reads can be removed with tests.

## 2026-07-14 — Isolate browser sessions per Firebase UID
- Context: Logout previously had no real Firebase sign-out or local-data boundary, so another account could inherit Mother App state on the same browser.
- Decision: Archive local Mother App data per UID, clear the active view on logout/account change, observe Firebase auth continuously, and pin each Firestore write to its invocation UID.
- Alternatives considered: clear all data permanently; keep one shared local profile; implement full Firestore hydration now.
- Rationale: Per-UID snapshots close the immediate cross-account privacy gap while preserving same-device continuity with a small patch.
- Revisit if: native packaging begins, cross-device continuity is required, or real patient data is used.

## 2026-07-15 — Hydrate returning profile setup from the signed-in UID
- Context: Logout clears the active browser view for privacy, so a returning account without a local snapshot could be sent through PDPA and setup again even though its profile was already saved in Firestore.
- Decision: Restore the per-UID local snapshot first; when setup is absent or incomplete, read only `mothers/{auth.currentUser.uid}` and merge the profile into onboarding state before routing to Dashboard.
- Alternatives considered: keep Firestore write-only; use one shared local profile; hydrate all history in the same change.
- Rationale: This fixes the Demo's same-account login experience with a small owner-scoped read while avoiding cross-account leakage and a broad data migration.
- Revisit if: cross-device check-in/history continuity or encrypted health-data storage becomes a release requirement.

## 2026-07-16 — Merge owner Check-Ins in realtime with Firestore precedence
- Context: Check-Ins wrote to Firestore but another device kept showing its localStorage history until refresh or local entry.
- Decision: Listen to `mothers/{uid}/checkins`, normalize snapshots through the existing mood model, let Firestore replace same-date local entries, and retain local-only dates for pending offline writes without syncing remote merges back.
- Alternatives considered: replace local history with every snapshot; add timestamps and a custom conflict resolver; hydrate Profile, EPDS, Goal, and Journal in the same change.
- Rationale: Date-key merging delivers the requested realtime Check-In flow without losing offline entries, creating write loops, changing schema, or adding dependencies.
- Revisit if: deleted records must propagate, concurrent same-day edits need stronger conflict handling, or history volume requires query limits.

## 2026-07-17 — Use redirect auth across web platforms
- Context: `signInWithPopup` flashed and failed on unauthorized hosts and is unreliable in mobile or embedded browsers.
- Decision: use Firebase `signInWithRedirect` for normal browsers, block embedded WebViews with external-browser guidance, and preserve onboarding intent across the redirect.
- Alternatives considered: keep popup auth on desktop with redirect fallback on mobile; add more popup retries.
- Rationale: one cross-platform path removes popup blockers and desktop/mobile branching from the login flow.
- Revisit if: native app auth is introduced or a verified popup experience becomes a product requirement.

## 2026-07-18 — Serve redirect-auth helpers from each production origin
- Context: Safari 16.1+ blocks the cross-origin storage used when the Vercel app redirects through Firebase helpers on `firebaseapp.com`; the app has two Vercel production aliases.
- Decision: Transparently proxy `/__/auth/**` through Vercel and use the current registered production alias as `authDomain`; keep Firebase Hosting as the same-origin fallback and direct embedded WebViews to an external browser.
- Alternatives considered: restore popup auth, redirect every alias to one canonical hostname, self-host Firebase helper files, or replace Firebase Auth with provider-specific SDKs.
- Rationale: Transparent rewrites preserve one Firebase redirect flow with no new dependency while satisfying Safari's same-origin storage requirement on both public aliases.
- Revisit if: a custom canonical domain is introduced, a native auth flow replaces browser redirect auth, or a production alias is added or removed.

## 2026-07-18 — Temporarily canonicalize Vercel aliases to Firebase Hosting
- Context: Both Vercel aliases were production-ready at the CDN but their Google OAuth callbacks remained unregistered, while the Firebase-hosted app already passed the Safari same-origin flow.
- Decision: Return temporary 307 redirects from both Vercel aliases to `afterbloom-18d15.firebaseapp.com`; canonicalize non-root Vercel entrypoints client-side and migrate stale Vercel workers by clearing caches, reloading clients, and unregistering.
- Alternatives considered: leave both links broken pending manual OAuth configuration or restore popup auth.
- Rationale: One reversible routing rule uses the already verified deployment and avoids cross-origin storage without new authentication code.
- Revisit if: preserving the Vercel hostname is required after both exact OAuth callback URIs are registered.

## 2026-07-18 — Adopt the approved Care Journey 1807 clinical contract
- Context: Runtime phase boundaries, EPDS timing, detailed content, and worry persistence disagreed with the approved Thai Care Journey plan.
- Decision: Use 1-based calendar postpartum days, nine inclusive phases, latest-only EPDS checkpoints at Day 8/22/181, Thai-only detailed content, raw worry persistence, and the permanent global Help/1323 path.
- Alternatives considered: Preserve zero-based stages, queue every missed EPDS checkpoint, or publish an unreviewed English detailed journey.
- Rationale: One explicit contract removes boundary drift and avoids surfacing stale screening prompts or unapproved clinical translations.
- Revisit if: a year-two phase contract or clinically approved English copy is provided.

## 2026-07-19 - Move AfterBloom from hospital B2B2C to direct B2C
- Context: Product validation showed the hospital staff channel did not work as the supported delivery path.
- Decision: The Mother App has no hospital onboarding, hospital dashboard, hospital callback, or hospital alert integration. Do not create `support_request` or `hospital_contact_initiated`; retain emergency paths and source-only CareCircle until its replacement flow is approved.
- Alternatives considered: Preserve the B2B2C workflow; route Support Need immediately to CareCircle without a confirmed booking or provider contract.
- Rationale: Remove unsupported destinations and avoid storing or advertising a dead workflow while keeping emergency access available.
- Revisit if: A hospital partnership returns or the CareCircle provider and booking contract is approved.

## 2026-07-20 — Keep Admin as a read-only B2C observer
- Context: The hospital-mediated delivery path is retired, while historical Firestore records and Admin source remain useful for inspection.
- Decision: Keep only Dashboard, Mother List, and Mother Detail active. Route elevated Mother CTAs to the existing mock Care Circle. Staff may read clinical data but cannot write, resolve, add notes, seed, or clear through Admin.
- Alternatives considered: delete the Admin source and legacy fields; keep the former case workflow active; add a new Care Circle backend now.
- Rationale: This preserves 1807 clinical history and the smallest useful observer surface without creating a new schema or unsupported operational workflow.
- Revisit if: a real Care Circle provider/booking contract or hospital partnership is approved.

## 2026-07-20 — Make Journey a first-class Mother tab
- Context: The full Care Journey was too dense when expanded inside Home, while the requested Mother navigation needs six clear destinations.
- Decision: Keep Home as a compact current-stage summary and move the full bilingual 1807 Journey into a dedicated bottom tab with the shared sage `TabHero`. Keep EPDS and Profile as true tabs, and render `EPDS` as the compact nav label.
- Alternatives considered: Keep the full Journey on Home; add a new route; keep a long `Emotional Check` nav label.
- Rationale: The existing tab shell and `CareTimeline` already provide the needed behavior without a route or schema change, while the shorter labels preserve one-handed mobile navigation.
- Revisit if: Journey needs deep-linking, a clinician-approved content model replaces the current data source, or the nav grows beyond six primary destinations.

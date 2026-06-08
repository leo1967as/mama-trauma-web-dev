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

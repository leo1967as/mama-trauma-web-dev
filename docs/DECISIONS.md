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

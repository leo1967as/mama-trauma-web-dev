# Afterbloom 1507 Implementation Plan

## Status
- Created: 2026-07-15
- Sources: `docs/Mood_Check_In_1507.md`, approved `docs/Care_Jounry_1807.md`
- Scope: implement only active sections; skip every block marked `No use`
- Replaces the outdated gap assumptions in `BRIEF-GAP-TASKS.md`

## Excluded
- `hospital_name`
- `sharing_preference`
- Partial check-in/equal-weight scoring addendum marked `No use`

## Verified Baseline
- [x] Welcome and required onboarding fields: `mother_name`, `baby_birth_date`, `is_first_time_mother`, `preferred_checkin_time`
- [x] Four core daily questions, raw reversed worry storage, and weighted composite `(mood*2 + sleep + energy + (6-worry)) / 5`
- [x] Conditional Problem Tags (max 2), optional 500-character journal, and Baby Connection
- [x] Support Need pattern, 3-day snooze, four support levels, critical-tag/connection/EPDS-Q10 escalation
- [x] Tiny Goal choices including skip, scheduled/triggered EPDS, global Help access, and Firestore payload normalization
- [x] Existing automated baseline: `npm test` passes 15/15 on 2026-07-15

## Task 0 - Decision Gate (must finish first)
- [x] Approved Thai Care Journey warning signs, weighted scoring wording, and EPDS timing for implementation.
- [x] Confirmed 1-based stage boundaries: Day 1-3, Day 4-7, Day 8-21, Day 22-42, Day 43-90, Day 91-150, Day 151-180, Day 181-270, Day 271-365.
- [x] Confirmed routine EPDS checkpoints at Day 8, 22, and 181 with latest-phase-wins.
- [x] Confirmed Problem Tag maximum 2.
- [x] Confirmed raw `worry_score >= 4`; inversion exists only inside the composite formula.
- [x] Created an English review draft outside runtime; detailed English remains hidden until clinical/language approval.

## Task 1 - Close Mother-to-Admin Episode Loop (hardest)
- [x] Make High-Risk tags create a hospital dashboard flag without escalating the mother to Level 4.
- [x] Invoke the existing Firestore resolution check when the Mother App starts/resumes so a resolved episode can re-enable Support Need.
- [x] Verify "Yes, please", callback request, direct hospital contact, urgent Help, and plain Help remain distinct events.
- [x] Add focused tests for High-Risk alert creation and resolved/retrigger behavior.
- [ ] Run a synthetic Firebase tracer: Mother low/urgent check-in -> Admin alert -> resolve -> Mother refresh -> eligible retrigger.

Acceptance: Mother and Admin show the same scores, trigger reason, event time, case source, and resolved state; no callback or urgent flag is inferred from merely opening Help.

Likely files: `src/lib/firebase-sync.js`, `src/lib/support-episode.js`, `src/App.jsx`, `Admin-Dashboard/src/lib/alerts.js`, `tests/`.

## Task 2 - Align the 9-Phase Care Journey Data
- [x] Replaced Month 4-6/Year 1+ with separate Month 4-5 and Month 6 phases and a Day 365 clamp.
- [x] Stored all four sections and Sources per phase.
- [x] Copied approved Thai content from `docs/Care_Jounry_1807.md` and preserved safety wording.
- [x] Kept postpartum stage generation based only on `baby_birth_date`.
- [x] Added one boundary/calendar-day test covering every transition, Day 365, and >365.

Acceptance: every postpartum day 0-365 resolves to exactly one approved phase; no duplicated or missing day ranges.

Likely files: `src/lib/user-data.js`, `src/lib/i18n/th.json`, `src/lib/i18n/en.json`, `tests/`.

## Task 3 - Build the Full Care Journey View
- [x] Reused the Home Care Journey card without a new route or dependency.
- [x] Showed current phase first and other phases with native `<details>`.
- [x] Routed every Care Journey heart/help action through global Help.
- [x] Showed EPDS CTA only when `isEpdsDue()` is true.
- [x] Kept `1323` permanently at the end of the list.
- [x] Verified native keyboard behavior, Thai wrapping, 390px, and desktop layouts.

Acceptance: the complete approved Care Journey is readable from Home, Help is always reachable, and the hotline footer cannot be dismissed permanently.

Likely files: `src/components/afterbloom/CareTimeline.jsx`, one small Care Journey view component if needed, `src/pages/Dashboard.jsx`.

## Task 4 - Reconcile EPDS Timing and Episode Rules
- [x] Applied routine checkpoints Day 8, 22, and 181 only.
- [x] Kept mood-low 3 days, raw worry-high 3 days, Extra Support, and urgent safety triggers.
- [x] Kept one screening per checkpoint or unresolved trigger episode.
- [x] Kept EPDS Item 10 as immediate Level 4 regardless of composite score.
- [x] Extended tests for latest-phase-wins, completion suppression, and legacy aliases; existing Q10 rules remain unchanged.

Acceptance: the latest reached checkpoint appears once when due; older missed phases are not queued, and unresolved trigger episodes do not repeat.

Likely files: `src/lib/epds-data.js`, `src/components/afterbloom/EpdsFlow.jsx`, `tests/epds-rules.test.js`.

## Task 5 - Final Mood Spec Copy Audit (easier)
- [x] Compare EN/TH core question labels and descriptions against the dated Mood document.
- [x] Compare all four support-level messages and CTAs; keep visible wording as "Today's Support Level", never "Risk Level".
- [x] Verify `problem_other_text` required only for Other, max 150 characters, and journal remains optional at max 500.
- [x] Verify Tiny Goal choices exactly match the dated document and include skip.
- [x] Remove only confirmed copy mismatches; do not rewrite approved logic.

Acceptance: active Mood document copy and field limits match the UI in both languages.

Likely files: `src/lib/i18n/en.json`, `src/lib/i18n/th.json`, `src/components/afterbloom/CheckInFlow.jsx`.

## Task 6 - Release Verification
- [x] Run `npm test`, `npm run lint`, and `npm run build` for Mother App.
- [x] Run Admin lint/build sequentially on this Windows machine.
- [ ] Run Playwright smoke at mobile and desktop widths: onboarding, steady check-in, conditional low check-in, Level 4, Care Journey, EPDS, Help, logout.
- [x] Run focused Care Journey Playwright at 390px and desktop: current-first details, Help, EPDS due/not-due, 1323, and English summary-only.
- [ ] Complete the live Firebase tracer from Task 1 with synthetic data only.
- [x] Record failures in `docs/FAILED_ATTEMPTS.md`; do not weaken clinical test cases to make them pass.

## Task 7 - Session Close
- [x] Updated `docs/CONTRACTS.md` for stage, EPDS, postpartum day, and raw-worry payload decisions.
- [x] Updated `docs/CURRENT_STATE.md`, `docs/KNOWN_ISSUES.md`, and the dated session log.
- [x] Marked completed boxes here and set the next item in `tasks/TODO.md`.

## Ponytail Constraints
- Reuse current scoring, Help overlay, Firestore sync, i18n, and test setup.
- Add no dependency, router, generic content engine, or speculative hospital API.
- One source of truth per rule; tests cover boundaries and safety paths only.

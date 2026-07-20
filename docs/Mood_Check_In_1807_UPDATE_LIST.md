# Mood Check-in 1807 — Google Doc Update List

## Review status

- Source checked: [AfterBloom Google Doc](https://docs.google.com/document/d/18HwPRBkykc80WJv3CtZTtr_yIh_3ywsy6pYyHXBks68/edit?tab=t.95wq7scsqyb)
- Checked: 2026-07-18
- Local comparison: `Mood_Check_In_1507.md` and `Mood_Check_In_1807.md` have no substantive content difference.
- Important: this file records findings only. It does not replace the source document or change runtime code.

## New material present in the Google Doc but absent from the local Mood files

1. Care Journey content draft
   - 9 phases: Day 1–3, Day 4–7, Week 2–3, Week 4–6, Month 2–3, Month 4–5, Month 6, Month 7–9, Month 10–12.
   - Four sections per phase: What you might feel, Your body, Watch out for, Tips / Self-care.
   - EPDS prompts shown in the content at Week 2–3, Week 4–6, and Month 7–9.
   - Permanent 1323 help footer guidance.
   - Marked pending Clinical Advisor approval before implementation.
2. Care Circle MVP scope
   - Marketplace-style caregiver and therapist support sections.
3. Clinical review and evidence notes
   - Safety-trigger evidence for EPDS Item 10, self-harm responses, and ACOG guidance.
   - Problem-tag gap review, evidence strength, and suggested additional tags.
   - Daily check-in burden, dropout, adherence, and frequency discussion.
4. Additional Thai revision / duplicate review blocks
   - Repeated Thai check-in and support-level sections.
   - Reviewer comments and change markers such as `Need Update`, `Fixed`, and `Pending Approval`.

## Contract differences that must be resolved before treating the Google Doc as runtime source

| Area | Google Doc currently says | 1807 runtime contract |
|---|---|---|
| Postpartum day | `Today - baby_birth_date`; examples 14/42/90 | Local calendar day, 1-based; 9 inclusive phases |
| EPDS timing | Week 2 / Week 6 / Month 3 / 6 / 9 / 12 | Day 8 / 22 / 181; latest due checkpoint only |
| Worry field | Intro names `anxiety_score`; detailed field is `worry_score` | Raw `worry_score`; inversion only inside composite |
| Problem Tags | Data type says max 2; UI says “select up to 3” | Maximum 2 |
| Composite score | Weighted `/5` and a separate equal-weight `/4` block both appear | Weighted composite only |
| Level 4 | Multiple duplicated trigger definitions appear | One approved safety-trigger contract |
| Clinical status | Care Journey is pending advisor approval | Thai runtime copy is approved; English remains review-only |

## Action list

- Keep this list as the review record; do not silently merge the Google Doc into `Mood_Check_In_1807.md`.
- Ask the Clinical Advisor to approve one source of truth for postpartum phases, EPDS timing, scoring, tags, and Level 4 logic.
- After approval, update the Mood source document and tests together; until then, treat the Google Doc additions as review material only.

## Main tab comparison - 2026-07-19

- Compared Google Doc tabs `t.0` and `t.d14dhchtejhq` through the text export, then compared the result with `docs/Mood_Check_In_1807.md`.
- Tab `t.d14dhchtejhq` contains the B2C cutover note. Tab `t.0` contains that same note followed by the existing Mood Check-in specification; the `Need Update` blocks are already present in the local Mood file.
- The unambiguous B2C changes are already implemented in the Mother runtime: no hospital onboarding/dashboard/callback/support-request flow, emergency help retained, and CareCircle kept source-only.
- Tiny Goal, auto-generated Care Journey, persistent Help, weighted composite scoring, raw worry storage, and max-two Problem Tags are already implemented.
- The main tab still contains historical hospital sections marked `No use`, plus an older EPDS timing proposal. The runtime keeps the approved 1-based Care Journey and Day 8/22/181 EPDS contract; do not silently change clinical timing from the mixed draft.

## Demo Source-of-Truth Gate — live Core

- Google tab `t.0`: legacy/reference-only. It still contains the B2B hospital dashboard, callback, hospital CTA, `support_request`, and `hospital_contact_initiated`.
- Google tab `t.95`: content-safe, but reconcile EPDS timing to the live Core contract: Day 8 / 22 / 181.
- Google tab `t.p2` Care Circle: aligned mock-only; no production provider or booking workflow.

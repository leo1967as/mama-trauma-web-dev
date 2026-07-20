# Afterbloom App — Brief Gap Audit

**Brief Document:** Afterbloom App and Dashboard (1).md  
**Audit Date:** 2026-07-13  
**Codebase:** Afterbloom (React+Vite) + Admin Dashboard  
**Review Scope:** Afterbloom patient app (root `/`) — Daily Check-in, Home Screen, Care Journey, EPDS, and Help features.

---

## Executive Summary

The core check-in flow, home screen, and safety features are **substantially implemented**. However, several gaps exist in onboarding completeness, problem tag alignment with brief, EPDS trigger timing, hospital integration, and full tab implementations. **Highest impact gaps** are hospital alerts/integration (blocking B2B feature), EPDS screening triggers (clinical requirement), and missing onboarding fields (user experience gap).

---

## Home Screen

### Tasks

- [ ] **Verify greeting uses correct mother_name field** — Code reads `getDisplayName()` which falls back through `preferred_name → mother_name → legal_first_name → "คุณแม่"`. Brief spec requires showing mother's name. *Appears implemented; verify translations.* (P2)
  - File: `src/pages/tabs/HomeTab.jsx:259`

- [ ] **Implement "I Need Help" button as persistent overlay** — Currently rendered via SafetySection but verify it's **always** visible and doesn't require check-in completion. Brief spec (Step 8, Line 832) requires "ปุ่ม I Need Help ต้องอยู่ทุกหน้า". *SafetySection exists but may not be on all tabs.* (P1)
  - File: `src/components/afterbloom/SafetySection.jsx`

- [ ] **Add "Not checked in yet today" message for support level when no check-in** — Brief spec (Step 2, Line 162) requires: "Not checked in yet today". Code only shows support level if check-in exists. (P2)
  - File: `src/pages/tabs/HomeTab.jsx:376-380`; Add fallback when `!moodSummary.hasTodayCheckIn`

- [ ] **Verify Care Journey card displays only current stage, not all stages** — Code shows a sliding 3-node window (prev/current/next). Brief (Step 6, Line 790) shows only current week's journey card on Home. *Appears correct but verify card only shows one stage at a time.* (P2)
  - File: `src/components/afterbloom/CareTimeline.jsx:30-34`

- [ ] **Ensure Mood Trend chart displays last 7 days** — Code calls `getMoodChartData(moodEntries, 7)`. Brief requires 7-day trend on home. *Implemented; verify it shows only recent data.* (P2)
  - File: `src/pages/tabs/HomeTab.jsx:55`

---

## Onboarding (Steps 0–1)

### Tasks

- [ ] **Implement Step 0: Welcome screen with "Start my care journey" CTA** — Brief spec (Lines 13–20) requires welcome screen. Onboarding.jsx shows a `WelcomeBtn` component but structure unclear. **Verify full welcome flow exists.** (P1)
  - File: `src/components/afterbloom/Onboarding.jsx:61–80` (partial)

- [ ] **Add "First-time mother?" question (Step 1.3)** — Brief spec (Lines 60–74) requires this field. Code shows only `is_first_time_mother` in onboarding data but question not visible in Onboarding.jsx. **Need to verify this question is asked during onboarding.** (P2)
  - File: `src/lib/user-data.js:29–31` (data exists); Onboarding.jsx (implementation TBD)

- [ ] **Add "Delivery hospital" field (Step 1.4)** — Brief spec (Lines 78–88) requires hospital name input. **Not found in codebase.** Add to onboarding flow and store in `hospital_name` field. (P2)
  - File: `src/lib/user-data.js` — missing `hospital_name` field storage

- [ ] **Add "Preferred check-in time" field (Step 1.5)** — Brief spec (Lines 92–108) requires reminder time preference (Morning/Afternoon/Evening/Before bed/Self-check). Code stores `preferred_checkin_time` but **verify the question is asked and all options are present.** (P2)
  - File: `src/lib/user-data.js:33–35` (stored); Onboarding.jsx (implementation TBD)

- [ ] **Add "Privacy preference" field (Step 1.6)** — Brief spec (Lines 112–127) requires sharing preference selection. **Not found in codebase.** Add field for `sharing_preference` (not yet / family / care team / later). (P2)
  - File: `src/lib/user-data.js` — missing `sharing_preference` field

- [ ] **Ensure baby birth date is mandatory and used to calculate postpartum stage** — Code uses `baby_birth_date` to derive `getCurrentStage()`. Brief notes (Line 54–56): "ห้ามตัด" (must not cut). *Implemented; verify it's required field.* (P1)
  - File: `src/lib/user-data.js:41–46, 81–86`

---

## Daily Check-in (Phases 1–3)

### Core Questions (Phase 1)

- [ ] **Verify Mood question displays with correct emoji + labels** — Brief spec (Section 3.1, Lines 205–246). Code has MoodFace SVG for 1–5 scale with color theme. **Verify emoji/wording matches brief exactly.** Thai: "วันนี้คุณแม่รู้สึกอย่างไรบ้างคะ?", options: แย่มาก/แย่/เฉยๆ/ดี/ดีมาก. (P2)
  - File: `src/components/afterbloom/CheckInFlow.jsx:37–110` (faces); verify i18n strings match brief

- [ ] **Verify Sleep question wording includes "even if you woke up often"** — Brief spec (Line 251, Line 270–280) emphasizes: "(even if you woke up often)". This framing is critical for postpartum context. **Verify English and Thai versions include this note.** (P2)
  - File: `src/lib/i18n/en.json` and `src/lib/i18n/th.json` — checkin.questions[1].subtitle

- [ ] **Verify Energy question displays correctly** — Brief spec (Section 3.3, Lines 299–342). Code structure present. **Verify all 5 labels match brief tone.** (P2)
  - File: `src/components/afterbloom/CheckInFlow.jsx` (generic label loop); verify i18n

- [ ] **Verify Worry question is reversed (1 = calm, 5 = overwhelmed)** — Brief spec (Lines 345–389, Line 364): "IMPORTANT for developer: worry_score is REVERSED." Code line 33 comment confirms: `reverse: true`. Composite calculation line 113 uses `6 - worryScore`. **This is critical — verify inversion is consistent throughout.** (P1)
  - File: `src/components/afterbloom/CheckInFlow.jsx:33, 113`

- [ ] **Verify composite score formula: (mood + sleep + energy + adjusted_worry) / 4** — Brief spec (Line 595). Code computes composite as `[values.moodScore, values.sleepScore, values.energyScore, 6 - values.worryScore].reduce(...) / scored.length`. **Verify weighting is equal (25% each).** (P1)
  - File: `src/components/afterbloom/CheckInFlow.jsx:112–116`

### Follow-up Questions (Phase 2) — Conditional Trigger

- [ ] **Verify Phase 2 triggers when composite_score < 2.5 OR any single indicator = 1** — Brief spec (Line 399). Code line 613: `composite < 2.5 || [scores including adjusted worry].includes(1)`. **Verify this condition is checked correctly; note that worry = 1 means adjusted = 5 (high worry).** (P1)
  - File: `src/components/afterbloom/CheckInFlow.jsx:613`

- [ ] **Problem Tag selection — max 2, with "Something else" text input** — Brief spec (Lines 405–464). Code implements `ProblemTagScreen` with toggle logic capping at 2, showing textarea for "Something else". **MAJOR GAP: Code lists ~15 tags, brief has 22 Thai tags + 15 English tags. Verify tag set matches brief exactly.** (P1)
  - File: `src/components/afterbloom/CheckInFlow.jsx:286–317`; `src/lib/i18n/en.json` and `th.json`

- [ ] **Problem tags must be classified into 3 clinical groups (Safety-Critical / High-Risk / Monitoring)** — Brief spec (Lines 659–680) requires specific tags to trigger Level 4, others to flag for dashboard, others for monitoring only. **Current code does not implement this classification.** Tag classification is essential for clinical escalation logic. (P1)
  - File: `src/lib/mood-data.js` — missing tag classification logic; need to add enum/map for Safety-Critical/High-Risk/Monitoring tags

- [ ] **Optional Journal — 500 char limit, never blocks, skipable** — Brief spec (Lines 467–477). Code implements `JournalScreen` with 500 char limit and `Continue` button (no block). **Appears implemented correctly.** (P2)
  - File: `src/components/afterbloom/CheckInFlow.jsx:319–332`

- [ ] **Baby Connection question — 1–5 scale, framing must not imply judgment** — Brief spec (Lines 481–512). Code implements `BabyConnectionScreen` with 5 options. **Verify labels match brief tone** (e.g., avoid "disconnected"/"bad mother" language). Thai: รู้สึกห่างเหิน → รู้สึกผูกพันและอบอุ่นมาก. (P2)
  - File: `src/components/afterbloom/CheckInFlow.jsx:334–358`; verify i18n

### Phase 3: Support Need — Pattern-Triggered Only

- [ ] **Implement support_request question (Phase 3.9)** — Brief spec (Lines 519–549): Only ask when pattern detected (3 consecutive days < 2.5 OR same day mood=1 & worry=5). Code has `SupportNeedScreen` (step 8) but **verify trigger logic is correct**. Current code has `isSupportNeedTriggered()` but logic unclear. (P1)
  - File: `src/components/afterbloom/CheckInFlow.jsx:629, 635` (trigger calls); `src/lib/mood-data.js` (trigger logic TBD)

- [ ] **Support Need must not re-appear until 3 days pass (if answered "Not right now")** — Brief spec (Line 549): "Wait 3 days. Re-trigger if scores remain low." **Need episode suppression logic.** Current code has `isSupportEpisodeSuppressed()` call but verify implementation. (P1)
  - File: `src/lib/support-episode.js` — verify 3-day snooze logic

- [ ] **After "Yes, please" in Support Need, flag hospital dashboard and hide question** — Brief spec (Line 548). **Hospital integration missing; no Firebase alert sent.** This blocks Admin Dashboard feature. (P1)
  - File: `src/lib/firebase-sync.js` — need to implement `syncSupportRequest()` to send to Firestore

---

## Check-in Result Output (Section 4)

### Scoring & Support Levels

- [ ] **Verify all 4 support levels display correct messages and CTAs** — Brief spec (Section 4.2, Lines 605–696). Code has 4 levels (steady/gentle/extra/immediate) with messages. **Verify exact wording matches brief** for each level and language. (P2)
  - File: `src/lib/mood-data.js:10–36` (SUPPORT_LEVELS); `src/lib/i18n/en.json` & `th.json`

- [ ] **Level 1 (Steady): composite >= 3.5** — Brief spec (Line 606). Code implements this threshold. *Appears correct.* (P2)

- [ ] **Level 2 (Gentle Support): 2.5 <= composite < 3.5** — Brief spec (Line 625). *Appears correct.* (P2)

- [ ] **Level 3 (Extra Support): 1.5 <= composite < 2.5 OR mood <= 2 AND worry >= 4** — Brief spec (Line 641). Code checks this. **Verify OR logic is correct.** (P2)
  - File: `src/lib/mood-data.js:150–160`

- [ ] **Level 4 (Immediate Support) — Multiple triggers:**
  1. **User selects "Yes, please" in Support Need** — Brief spec (Line 684A). *Implemented.*
  2. **baby_connection = 1 AND composite < 2.5** — Brief spec (Line 684B1). Code checks `supportNeedPattern && babyConnectionScore === 1`. **Verify this override works.** (P1)
  3. **Safety-Critical tag selected AND composite < 1.5** — Brief spec (Line 684B2). **Tag classification missing — cannot implement until tag groups defined.** (P1)
  4. **EPDS Item 10 (self-harm thoughts) >= 1** — Brief spec (Line 684B3). EPDS code checks `q10Flag = answers[9] > 0`. **Verify this escalates to Level 4 immediately.** (P1)
     - File: `src/components/afterbloom/EpdsFlow.jsx:128`; verify support level escalation

- [ ] **Hospital Dashboard Alerts:**
  - **Alert A: support_request = true → immediate notification** — Brief spec (Line 700). **Not implemented.** Need Firebase function to push to hospital dashboard. (P1)
  - **Alert B: composite < 2.5 for 3 consecutive days → flag on dashboard** — Brief spec (Line 702). **Not implemented.** Need trend tracking and hospital notification. (P1)
  - **Alert C: safety_access_used = true → log and flag** — Brief spec (Line 703). Code calls `logSafetyAccess()` and `syncSafetyAccess()` but **verify data reaches hospital dashboard.** (P1)
    - File: `src/lib/mood-data.js:69–75`; `src/lib/firebase-sync.js` (TBD)

---

## EPDS Screening (Section 4 / Step 7)

### Trigger Logic

- [ ] **Verify EPDS screening triggers at correct times** — Brief spec (Lines 801–810): Week 2, Week 6, Month 3, 6, 9, 12 OR composite < 2.5 OR mood <= 2 for 3 days. Code has `isEpdsDue()` but **verify triggers match brief exactly.** (P1)
  - File: `src/lib/epds-data.js` — verify trigger conditions

- [ ] **EPDS must NOT appear more than once per unresolved episode** — Brief spec (Line 803, note on Page 815). **Verify episode logic prevents duplicate screenings.** (P1)
  - File: `src/lib/epds-data.js` or `src/lib/support-episode.js`

- [ ] **Use term "Emotional Check" not "Depression Test"** — Brief spec (Lines 816). Verify all UI copy uses this term. (P2)
  - File: `src/lib/i18n/en.json` & `th.json` — search for EPDS/depression labels

### EPDS Scoring

- [ ] **Verify EPDS score computation (10 questions, specific reverse-scoring on items 2, 4–9)** — Brief spec (CLAUDE.md): "reverse-scored on questions 2,4–9". Code has `computeEpdsScore()`. **Verify scoring algorithm matches clinical EPDS standard.** (P1)
  - File: `src/lib/epds-data.js` — verify reverse-scoring logic

- [ ] **Verify EPDS Item 10 (self-harm) immediately escalates to Level 4** — Brief spec (Line 684B3). Code checks this: `if (answers[9] > 0) escalate`. **Verify logic is triggered on any non-zero answer to Item 10.** (P1)
  - File: `src/components/afterbloom/EpdsFlow.jsx:125`

- [ ] **EPDS result must show support level + quote + next steps** — Brief spec (EpdsFlow Result section). Code implements Result screen with badge, message, quote, score details. **Verify all elements present.** (P2)
  - File: `src/components/afterbloom/EpdsFlow.jsx:120–221`

---

## Tiny Goal Selection (Step 5)

- [ ] **Verify Tiny Goal appears only after check-in result, with 3–5 options** — Brief spec (Lines 759–767). Code implements `TinyGoalSection` in result screen with `getSuggestedGoals(level, 3)` (max 3). **Brief shows ~5 examples; verify goal pool is sufficient.** (P2)
  - File: `src/components/afterbloom/CheckInFlow.jsx:381–428`; `src/lib/goals-data.js`

- [ ] **Tiny Goal must include "Skip for today" option (defer/snooze)** — Brief spec (Line 774): "ต้องมี 'ข้ามวันนี้ก่อน'". Code implements skip button. *Appears correct.* (P2)
  - File: `src/components/afterbloom/CheckInFlow.jsx:422–425`

- [ ] **Goal selection must persist and display in home after selection** — Brief spec (Step 2, Line 164): "Tiny goal: Take one deep breath before feeding". Code calls `setDailyGoal()` but **verify goal displays on home screen.** (P2)
  - File: `src/components/afterbloom/DailyGoal.jsx` (verify rendering)

---

## I Need Help / Safety Access (Step 8)

- [ ] **I Need Help button must be always visible on all screens** — Brief spec (Lines 832, 853). Code has SafetySection component but **verify it's rendered on every tab and doesn't disappear.** Currently only on HomeTab; need to add to other tabs. (P1)
  - File: `src/components/afterbloom/SafetySection.jsx`; add to MoodTab, TherapyTab, CarePlansTab, CircleTab

- [ ] **I Need Help must show 4 options (Trusted person / Hospital / Read coping tips / Unsafe)** — Brief spec (Lines 835–851). Code shows 4 triage options: trusted/hospital/safe (tools)/urgent (emergency). **Verify options match brief.** (P2)
  - File: `src/components/afterbloom/SafetySection.jsx:336–343`

- [ ] **"I'm not safe" path must show emergency support immediately** — Brief spec (Lines 843–851): "ไปหน้า urgent support ทันที". Code has urgent path with hotlines (1323, 1669). *Appears correct.* (P2)
  - File: `src/components/afterbloom/SafetySection.jsx:446–453`

- [ ] **Safety access must be logged with timestamp** — Brief spec (Line 565–566). Code calls `logSafetyAccess()` with timestamp. **Verify logging includes dateKey, ts, and other metadata.** (P2)
  - File: `src/lib/mood-data.js:69–89`

- [ ] **Safety access must be synced to hospital dashboard (Alert C)** — Brief spec (Line 703). Code calls `syncSafetyAccess()` but **verify data reaches Firestore under `safety_log` subcollection.** (P1)
  - File: `src/lib/firebase-sync.js` — verify syncSafetyAccess implementation

---

## Care Journey / Postpartum Stages

- [ ] **Verify all 9 postpartum stages are defined and descriptions match brief** — Brief spec (Lines 882–1445 covers Day 1–3, 4–7, Week 2–3, Week 4–6, Month 2–3, 4–5, 6, 7–9, 10–12). Code defines STAGES with 9 entries. **Verify stage descriptions match brief "What you might feel" copy.** (P2)
  - File: `src/lib/user-data.js:69–79` (STAGES array); verify descriptions in i18n

- [ ] **Care Journey content must be displayable (read-only for now, can mock)** — Brief spec (Step 6, Lines 778–797): Care Journey card shows stage-specific copy. Current app shows only stage name + progress bar. **Implement expandable Care Journey detail view with full stage content (What you might feel / Your body / Watch out for / Tips).** (P2)
  - File: `src/components/afterbloom/CareTimeline.jsx` — add detail view or modal

- [ ] **Week 2 / Week 6 / Month 3/6/9/12 should highlight EPDS trigger points** — Brief spec (Lines 803–810). No special UI indicator for EPDS-trigger stages in timeline. (P3)

---

## Admin Dashboard Integration

- [ ] **Hospital dashboard must receive alerts when support_request = true** — Brief spec (Line 700): "immediate notification to hospital staff dashboard". **Not implemented.** Admin Dashboard lacks real integration. (P1)
  - File: `src/lib/firebase-sync.js` — need Firebase function to push alert

- [ ] **Hospital dashboard must display 3-day trend flags** — Brief spec (Line 702): "composite_score < 2.5 for 3 consecutive days → flag on hospital dashboard". **Not implemented.** Requires backend trend tracking. (P1)

- [ ] **Hospital staff must be able to mark episodes as resolved** — Brief spec (Line 704): "Hospital staff marks episode as resolved in dashboard." **Not implemented in Admin Dashboard.** (P1)

- [ ] **Contact Hospital options must work (call + request callback)** — Brief spec (Lines 734–742). Result screen shows "Contact hospital" button but **no backend integration to create actual callback request.** (P2)
  - File: `src/components/afterbloom/CheckInFlow.jsx:533–538` (button present); Firebase integration TBD

---

## Other Tabs (Lower Priority)

- [ ] **Mood Tab — Verify trending and mood history display** — Brief does not specify Mood tab details. Current implementation shows chart. **Status: Stub / Minimal (P3)**
  - File: `src/pages/tabs/MoodTab.jsx`

- [ ] **Therapy Tab — Verify content exists or is placeholder** — Brief does not specify Therapy tab. **Status: Unknown (P3)**
  - File: `src/pages/tabs/TherapyTab.jsx`

- [ ] **Care Plans Tab — Verify implementation** — Brief does not specify Care Plans tab. **Status: Unknown (P3)**
  - File: `src/pages/tabs/CarePlansTab.jsx`

- [ ] **Circle Tab — Verify invite/sharing feature** — Brief spec (Step 1.6) mentions "Invite Your Circle" as Phase 2 feature. **Status: Likely stub (P3)**
  - File: `src/pages/tabs/CircleTab.jsx`

---

## Language & Translations

- [ ] **Verify all check-in question wording matches brief exactly (English & Thai)** — Brief provides full Thai translations for all questions. **Compare i18n files to brief word-for-word.** (P2)
  - File: `src/lib/i18n/en.json` & `src/lib/i18n/th.json` — checkin.questions, checkin.result, epds, supportLevels sections

- [ ] **Verify support level messages use "Support Level" not "Risk Level"** — Brief spec (Line 584): "Do NOT use the term 'Risk Level'". Confirm all messages say "Today's Support Level". (P2)
  - File: `src/lib/i18n/en.json` & `th.json` — search "risk", "danger", clinical terminology

- [ ] **Verify "I Need Help" wording is consistent and supportive (non-clinical)** — Brief emphasizes warm, non-stigmatizing tone. **Audit all help-related copy for tone.** (P2)

---

## Summary

### By Priority

**P1 (Blocking/Critical):**
1. Hospital dashboard integration (alerts, callback requests, episode resolution) — Blocks B2B feature
2. Support Need pattern-trigger logic verification — Clinical requirement
3. Problem tag clinical classification (Safety-Critical/High-Risk/Monitoring) — Blocks Level 4 escalation logic
4. EPDS Item 10 self-harm escalation — Safety-critical
5. Verify composite score calculation and worry reversal throughout codebase — Foundation for all support levels
6. I Need Help button visibility on all tabs — Spec requirement
7. Support episode suppression (3-day snooze after "Not right now") — Prevents alert fatigue

**P2 (Important/Quality):**
1. Complete onboarding with all fields (hospital, privacy preference, first-time mother question)
2. Verify all i18n wording matches brief exactly
3. EPDS trigger timing (Week 2, 6, Month 3/6/9/12)
4. Tiny Goal pool sufficiency
5. Care Journey detail view with full stage content
6. Support level message tone audit
7. All problem tag options present in UI (currently ~15, brief has 22 Thai tags)

**P3 (Polish/Optional):**
1. Other tab implementations (Mood, Therapy, CarePlans, Circle)
2. Stage description highlights for EPDS trigger points
3. Full Care Journey expandable copy on home

### Top 5 Highest-Impact Gaps

1. **No Hospital Dashboard Integration** — Support request, trend alerts, and episode resolution logic are missing. This blocks the entire B2B model. Required for MVP if pilot hospital is involved.

2. **Problem Tag Clinical Classification Missing** — Tags must be classified into Safety-Critical/High-Risk/Monitoring to implement Level 4 escalation logic. Currently no way to auto-escalate on specific tag combinations.

3. **EPDS Screening Trigger Verification Needed** — Need to verify timing triggers (Week 2, 6, Month 3/6/9/12) match brief. Missing trigger logic for "3-day low mood trend".

4. **Onboarding Incomplete** — Hospital name, privacy preference, and first-time mother question not present in flow. These are required by brief and inform app behavior.

5. **Support Episode Suppression Logic Unclear** — "Not right now" answer should suppress Support Need for 3 days. Current implementation of `isSupportEpisodeSuppressed()` needs verification.

---

## Checklist Template for Resolution

For each gap, resolution should include:
- **Task:** Concrete description
- **File(s) Affected:** List specific source files
- **Brief Reference:** Line number or section
- **Testing:** How to verify when complete
- **Owner:** Dev or design

---

*Audit prepared for Afterbloom development team. All line numbers reference the brief document unless otherwise specified.*

## Daily Check-in Contract

Core score formula:
`composite_score = (mood_score * 2 + sleep_score + energy_score + (6 - worry_score)) / 5`

Firestore check-in writes use snake_case:
```json
{
  "mood_score": 1,
  "sleep_score": 1,
  "energy_score": 1,
  "worry_score": 5,
  "composite_score": 1,
  "support_level": "immediate",
  "problem_tags": ["overwhelmed"],
  "problem_tag_classes": ["critical"],
  "problem_other_text": null,
  "journal_entry": null,
  "baby_connection_score": 1,
  "support_request": false,
  "low_composite_trend": false,
  "selected_tiny_goal": null
}
```

Rules:
- Store raw `worry_score`; calculate `6 - worry_score` only inside the composite formula. New normalized/local/Firestore records do not persist `adjusted_worry`; legacy fields remain untouched and unread.
- Problem Tags accept at most 2 values.
- Mother local history may contain legacy camelCase. Mother and Admin readers must dual-read snake_case and camelCase.
- `support_request`, `safety_access`, `urgent_safety`, `hospital_contact_initiated`, `low_composite_trend`, and EPDS Q10 are distinct events.
- A plain Help open never sets `support_request` or `urgent_safety`.
- A `high` problem-tag class opens an Admin `high_risk_tag` flag without forcing Mother Support Level 4. A `critical` class follows the existing immediate-support thresholds.
- Admin resolution clears the active episode flags without deleting history.

## Profile Contract

New Firestore profile writes use `mother_name`, `preferred_name`, `baby_birth_date`, `is_first_time_mother`, and `preferred_checkin_time`. Legacy camelCase reads remain supported.

`postpartum_day` is the displayed 1-based local calendar day: the birth date is Day 1. Admin derives it from `baby_birth_date`/delivery date first and uses the stored field only as a legacy fallback.

## Care Journey Contract

- Thai runtime content source: `docs/Care_Jounry_1807.md`.
- Inclusive phases: Day `1–3`, `4–7`, `8–21`, `22–42`, `43–90`, `91–150`, `151–180`, `181–270`, `271–365`.
- Dates after Day 365 remain on the last phase until a year-two clinical contract exists.
- Thai and English runtime journeys expose the same nine phases and four detailed sections; English copy is maintained in `src/lib/care-journey-data.js` and remains subject to clinical review.
- The active Mother shell keeps a compact Journey summary on Home and exposes the full journey in the dedicated `Journey` bottom tab, with a shared sage `TabHero`.
- Source metadata remains in the journey data for internal traceability but is not rendered as a Sources/แหล่งอ้างอิง disclosure in any active stage.
- The permanent footer exposes Mental Health Hotline `1323` and the global Help flow.

## EPDS Schedule Contract

- Routine checkpoints are Day `8`, `22`, and `181`.
- Only the latest reached checkpoint can be due; missed checkpoints from earlier phases are not queued.
- Read-only completion aliases: `14 → 8`, `42 → 22`, `270 → 181`. Legacy `90`, `180`, and `365` entries remain history only.
- Manual, Extra Support, 3-day low mood, 3-day raw worry `>= 4`, urgent safety, and Q10 escalation remain available.

## Storage Keys
- `afterbloom_onboarding`
- `afterbloom_mood_history`
- `afterbloom_checkin_draft`
- `afterbloom_epds_history`
- `afterbloom_daily_goal`
- `afterbloom_safety_log`
- `afterbloom_support_episode`

## Session And Logout Contract
- `afterbloom_active_uid` identifies the data currently exposed to the UI.
- User-scoped `afterbloom_*` data is archived under `afterbloom_user_session:<uid>` when switching account or signing out.
- `afterbloom_lang` and `afterbloom_device_id` remain device-global.
- Data without an owning active UID is cleared, never adopted by the next authenticated account.
- Firebase auth changes are observed continuously so cross-tab sign-out/account switches update the visible session.
- Firestore writes capture their UID when invoked. Logout waits up to three seconds for tracked writes, then proceeds without reassigning them.
- Snapshot restore is same-device only; Firestore-to-device hydration is not implemented.

## Source Of Truth
- Scoring, tags, support levels: `src/lib/mood-data.js`
- Care Journey content: `src/lib/care-journey-data.js`
- EPDS triggers/checkpoints: `src/lib/epds-data.js`
- Firestore payloads: `src/lib/firebase-sync.js`
- Admin normalization/alerts: `Admin-Dashboard/src/hooks/useFirestoreData.js`, `Admin-Dashboard/src/lib/alerts.js`

## B2C And Admin Read-only Contract
- The active Mother App is direct B2C. Hospital onboarding, callback, hospital dashboard, `support_request`, and `hospital_contact_initiated` are retired/paused; legacy source and stored fields remain for history only.
- Check-in Result uses the UI-only action key `care_circle` for the existing mock `TherapyTab`. It adds no Firestore schema, booking API, or support-request write.
- Extra Support and Immediate Support may open Care Circle. Immediate Support keeps emergency line and safe-person actions primary; Care Circle is supplemental.
- Active Admin routes are `/`, `/mothers`, and `/mothers/:id`. Alerts, messages, reports, resources, and settings are retired from the active route graph and redirect to `/`.
- Admin reads mothers, check-ins, EPDS, and safety history only. Case status, assigned staff, `case_notes`, resolve links, hospital protocol copy, and all Admin mutation/seed/clear paths are inactive. Firestore staff access is read-only; Mother-owner writes remain unchanged.
- The 1807 clinical contract remains active: nine phases, weighted composite, and EPDS checkpoints Day 8/22/181.

## Push Notification Contract
- Authenticated devices register under `mothers/{uid}/devices/{deviceId}`.
- Device fields: `token`, `enabled`, `timezone`, `language`, `platform`, `permission`, `last_seen_at`.
- Lock-screen payloads must remain generic and never include scores, support level, journal text, tags, or diagnostic language.
- `notification_deliveries/{deliveryKey}` is server-owned idempotency state; clients have no access.
- Daily reminders use the device timezone and profile `preferred_checkin_time`.
- Push is supplementary only. Urgent and safety flows remain directly accessible without notification delivery.

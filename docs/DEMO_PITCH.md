# AfterBloom Demo Pitch

**Length:** 5–7 minutes  
**Message:** AfterBloom is a direct-to-consumer postpartum support companion: it helps a mother notice how she is doing, find an appropriate next step, and see a calm care overview when read by authorised staff.

## Demo story

Follow one mother through a small moment of need. She opens the Core tab, sees where she is in the 1807-day care journey, completes a check-in, and gets a useful next action. If she wants human support, Care Circle gives her a simple way to browse a mock support marketplace and save a request. Finish by showing the separate Admin read-only view: the same kind of care information is visible for overview, without turning the product into a hospital workflow.

## Exact click sequence and talk track

1. **0:00 — Core tab / home.** Start with the seeded mother account already signed in. Point to the current postpartum day and the Care Journey. Say: “This is direct B2C. The mother starts with her own care rhythm, not a hospital referral.”

2. **0:45 — 1807 journey.** Point to the current phase and say: “The journey is day-based, with the EPDS checkpoints at Day 8, Day 22, and Day 181. The current checkpoint is surfaced when it is due.” Do not imply every day is a clinical assessment.

3. **1:30 — Daily check-in.** Click **Complete today’s check-in**. Use the prepared answers that produce an **Extra** or **Immediate** support result. Say: “The check-in turns a few self-reported signals into a clear support level and a next action.” Click **Care Circle** on the result.

4. **2:45 — Care Circle.** In **Care Circle**, click **Caregiver Support**, choose a provider card, open the provider detail, then click the request/booking CTA. Choose the prepared date/time and confirm the request. Say: “This is a lightweight marketplace concept: the mother can choose the kind of support that fits today.” Point to the confirmation. “This request is a local mock state for the demo; it is not a live booking.”

5. **4:00 — Alternate help path.** Return to Core, click **I Need Help**, then **Therapist Support**. Say: “The same Care Circle surface is reachable from an explicit help moment, so the mother does not have to hunt for support.” Close or leave the surface visible.

6. **5:00 — Admin read-only overview.** Open the separate Admin app, click **Sign in with Google**, then **Dashboard**. Briefly click **Mother List**, select the prepared mother, and show **Mother Detail**. Say: “Admin is a read-only care overview: it helps authorised staff understand the mother’s recent state and EPDS/check-in history. The mother remains the primary product user.”

7. **6:15 — Close.** Return to the Core tab or leave Mother Detail visible. Say: “The product loop is notice, understand, and choose a next step—without claiming that the prototype has completed clinical or operational integration.”

## Demo data and state assumptions

- Use a fresh or reset Mother demo account with the Core tab open and a known postpartum day of **8, 22, or 181** so the EPDS checkpoint is visible.
- Seed one recent check-in that reaches **Extra** or **Immediate** so the **Care Circle** result action is available.
- Seed the Care Circle provider list and one selectable date/time. The confirmation is local mock state and may be device-specific.
- Keep the prepared Admin Google account on the demo allowlist. Admin data must already contain the same demo mother and read-only history.
- Use Chrome or Safari with popup/auth access enabled. Avoid promising a live cross-device update during the pitch.

## Limitations / what is not built

- No hospital integration, HIS/EMR connection, referral handoff, or hospital-facing B2B workflow.
- No hospital operations dashboard. The separate Admin surface is a **read-only care overview** for the demo.
- No callback flow, `support_request` API/object, provider backend, real booking, payment, messaging, or provider response workflow.
- Care Circle providers, availability, and confirmation are mock/local demo data.
- Admin access is prototype/demo access, not production staff lifecycle management or full RBAC.
- Check-ins and EPDS are support signals, not diagnosis, emergency triage, or a replacement for clinical judgement. The demo must not claim clinical validation or automated care delivery.

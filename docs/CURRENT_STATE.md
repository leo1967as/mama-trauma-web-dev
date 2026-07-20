## Status: active
## Last Updated: 2026-07-21
## Confidence: high

## Priority:
Rehearse the deployed B2C Mother/Admin demo paths with seeded state.

## Next Action:
Rehearse `docs/DEMO_PITCH.md` against `https://afterbloom-18d15.web.app`; Admin remains a separately built read-only surface.

## Risks:
- Local Google OAuth must use `http://localhost`; Firebase rejects the `127.0.0.1` origin.
- Both Vercel aliases temporarily redirect to `afterbloom-18d15.firebaseapp.com`; the visible hostname changes after navigation.
- Keeping the app directly on Vercel still requires both exact Google OAuth callback URIs before the temporary redirects can be removed.
- Embedded browsers cannot reliably complete provider auth and are instructed to reopen the app in Chrome or Safari.
- LocalStorage remains the Mother App fast/offline path. Check-In history now merges from an owner-scoped Firestore listener, but the two-device and offline/reconnect tracer is still pending.
- Browser snapshots are not encrypted at rest; replace them with platform secure storage before shipping native apps with real patient data.
- Clinical thresholds, messages, and emergency workflow still require clinical review.
- Admin authentication is prototype-only and must not protect real patient data.
- Admin JavaScript typecheck remains broadly broken; lint and production build pass.
- Mother and Admin production bundles still exceed the Vite 500 kB warning threshold.
- Care Circle provider, booking, and production routing backends are not implemented.
- Demo staff access is a three-email hard-coded allowlist; replace with custom claims/RBAC before real patient data.
- Cloud Functions cannot deploy until Firebase project `afterbloom-18d15` is upgraded to Blaze.
- Cross-browser Web Push requires a Firebase Web Push VAPID key and real Android/iOS device verification.
- English detailed Care Journey copy is now runtime and mirrors the Thai four-section content; clinical/source review remains pending.
- High-Risk problem tags are normalized but do not currently open an Admin flag. Mother-side resolution is checked at startup/resume, but the live Admin round-trip remains unverified.
- Legacy Admin-Dashboard alert/action/settings files remain as source-only history; active routes, imports, and writes are disabled.

## Recent Context:
On 2026-07-21 the current Mother workspace build was deployed to Firebase Hosting project `afterbloom-18d15`. Public smoke returned HTTP 200 for the app, manifest, and the new `CheckInFlow` chunk; the live HTML references the current build hash.

Mood Check-In Result now makes the computed support level (`Steady`, `Gentle Support`, `Extra Support`, or `Immediate Support`) a prominent color-coded label in the result header. The localized support message is also enlarged and rendered with the meaning-focused serif style; no scoring or persistence logic changed.

AfterBloom has moved from hospital-mediated B2B2C to direct B2C. Extra/Immediate Check-in Result actions now include `care_circle` and route to the existing Care Circle mock through TherapyTab; I Need Help → Therapist uses the same surface. Admin is active only for Dashboard, Mother List, and Mother Detail read-only views. Staff Firestore writes and Admin mutation/seed/clear paths are blocked; legacy B2B files and fields remain unreferenced. On 2026-07-20 the Mother bundle and Firestore rules were deployed to Firebase Hosting; public live smoke confirmed the new Thai onboarding and Care Circle markers.

Local Headroom CLI was repaired after `headroom proxy` failed with `ModuleNotFoundError: No module named 'headroom'`. The Python 3.11 entrypoint still existed, but the installed package directories had been left as pip-style `~eadroom*` rollback folders. Restored `headroom` and `headroom_ai-0.30.0.dist-info`; `headroom --help`, `headroom proxy --help`, `pip show headroom-ai`, and `headroom doctor` now run. Doctor reports the proxy live at `127.0.0.1:9876` with matching v0.30.0, while Codex routing still warns as not wrapped.

Care Journey 1807 is implemented: 1-based calendar postpartum days, all 9 approved phases and four localized sections. The Journey UI was updated to a card-based layout featuring short-data summary pills ("What you might feel", "Your body") and an elegant centered modal for the Full Guide reading experience, replacing the initial bottom-sheet and generic AI styling with high-contrast, impeccable typography. The dedicated Journey tab now owns the full journey with a shared sage Hero; Home keeps only the compact summary, and source metadata is internal-only. The nav uses Home, Check-in, Journey, Care Circle, EPDS, and Profile. Mother tests 31/31, lint/build, Admin lint/build, visual QA, and live Thai/English Journey smoke pass. The shell polish is deployed to Firebase Hosting.

The Google Doc was checked directly and its findings were saved to `docs/Mood_Check_In_1807_UPDATE_LIST.md`. The local 1507/1807 Mood files are substantively identical; the Google Doc is a larger mixed draft with Care Journey, Care Circle, evidence notes, duplicate revisions, and unresolved contract contradictions.

The latest Google Doc tabs were captured as `docs/Afterbloom_CareJourney_TAB_t95wq7scsqyb_RAW.txt` and `docs/Afterbloom_CareCircle_TAB_p2tz2s4f3vop_RAW.txt`. CareCircle planning tasks and the Care Journey comment register are in `docs/Afterbloom_CareCircle_PLAN_2026-07-18.md`; the source-only preview implementation is now in place with no backend work.

CareCircle source-only plan is implemented in the preview: Home and I Need Help share the existing internal surface, with caregiver/therapist categories, mock filters, provider detail, simple date/period request, and confirmation. Therapy was removed from BottomNav so it is not a separate feature; no backend or real booking workflow was added. Mother tests 31/31, lint, and production build pass.

Both production aliases now return a temporary 307 redirect to the Firebase-hosted app, avoiding Safari cross-origin auth storage and the unregistered Vercel OAuth callbacks. Production HTTP checks end at Firebase with 200. Vercel-path entrypoints also redirect client-side, and the migration worker clears old caches, claims stale clients, reloads them, then unregisters; the blocked-old-bundle WebKit simulation reached Firebase successfully. Real button tests on WebKit, desktop Chrome, and Android Chrome emulation all reached Google Accounts with the Firebase same-origin callback and no OAuth error. Tests 26/26, lint, and Vercel production build passed; a credentialed physical Safari callback remains pending.

Added owner-scoped Firestore `onSnapshot` Check-In sync. Remote snake_case records merge into local history by `dateKey`, Firestore wins same-day conflicts, local-only entries remain for offline writes, and remote merges do not write back. Mother tests 21/21, lint, production build, Firestore Rules review, and preview HTTP 200 pass. Deployed this build plus the pending logo/icon and restored tab backgrounds to `https://afterbloom-app.vercel.app`; Vercel reports production Ready and the page, manifest, service worker, icon, and realtime bundle were verified live. The authenticated two-device tracer and visual tab review remain pending.

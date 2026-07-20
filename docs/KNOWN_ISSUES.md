## [ISSUE-001] Local-only persistence
- Status: open
- Discovered: 2026-05-21
- Description: LocalStorage remains the primary Mother App fast/offline path. Per-UID snapshots isolate accounts, profile setup hydrates from the owner document, and Check-In history now merges from an owner-scoped Firestore realtime listener. The authenticated two-device/offline tracer is still pending, and browser snapshots are not encrypted at rest.
- Attempted fixes: Added one-way UID-pinned writes, bounded logout flush, per-UID local session isolation, profile hydration, and realtime Check-In merge with Firestore winning same-date conflicts while retaining local-only entries.
- Next step: run the Desktop <-> Mobile and offline/reconnect tracer, then move health data to encrypted platform storage before a native release.

## [ISSUE-003] Admin staff identity is prototype-only
- Status: open
- Discovered: 2026-06-27
- Description: Case actions and notes persist correctly, but the actor is recorded as `Prototype Staff` until staff authentication and identity are implemented.
- Attempted fixes: Workflow persistence was implemented; identity work was intentionally deferred with security.
- Next step: replace the prototype actor with the authenticated staff profile during the security phase.

## [ISSUE-004] Admin access control is demo-only
- Status: open
- Discovered: 2026-06-27
- Description: Admin uses Firebase Google Auth with a single hard-coded demo staff email. This is sufficient for pitching but not staff lifecycle management.
- Attempted fixes: Removed `admin/admin`, deployed owner/staff deny-by-default Rules, and verified unauthenticated reads return HTTP 403.
- Next step: replace the email allowlist with custom claims/RBAC before adding staff or real patient data.

## [ISSUE-006] Google redirect login fails on Safari cross-origin storage
- Status: investigating
- Discovered: 2026-07-17
- Description: The Safari code blockers are fixed. Both public Vercel aliases now temporarily redirect to the same-origin Firebase-hosted app because their direct Google OAuth callbacks remain unregistered.
- Attempted fixes: Added same-origin auth support, unconditional redirect-result resolution, storage-tolerant sign-in, WebView guidance, both Firebase Authorized Domains, a temporary production redirect to `afterbloom-18d15.firebaseapp.com`, client-side path canonicalization, and a Vercel-only cache-clearing migration worker. WebKit, desktop Chrome, and Android Chrome emulation reached Google Accounts through the real button with no OAuth error; a blocked-old-bundle WebKit simulation also migrated successfully.
- Next step: verify a credentialed callback on physical Safari/PWA. Register both exact Vercel callbacks later if preserving the Vercel hostname is required.

## [ISSUE-007] Legacy Admin Dashboard still contains B2B alert surface
- Status: open
- Discovered: 2026-07-19
- Description: Legacy alert/action/settings files and historical fixtures still model the former hospital workflow, but they are no longer imported by active routes. The active Admin surface is read-only Dashboard, Mother List, and Mother Detail.
- Attempted fixes: Removed active B2B routes, sidebar/top-bar hospital/alert UI, case controls, case-note reads, and Admin write paths; kept legacy source and stored fields intact.
- Next step: Archive or repurpose legacy files only if a future CareCircle provider-operations product is approved.

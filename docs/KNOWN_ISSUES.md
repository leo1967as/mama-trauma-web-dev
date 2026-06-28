## [ISSUE-001] Local-only persistence
- Status: open
- Discovered: 2026-05-21
- Description: Daily check-ins and project input are stored only in localStorage and will not sync across devices or users.
- Attempted fixes: none
- Next step: define backend/API shape before replacing local storage.

## [ISSUE-003] Admin staff identity is prototype-only
- Status: open
- Discovered: 2026-06-27
- Description: Case actions and notes persist correctly, but the actor is recorded as `Prototype Staff` until staff authentication and identity are implemented.
- Attempted fixes: Workflow persistence was implemented; identity work was intentionally deferred with security.
- Next step: replace the prototype actor with the authenticated staff profile during the security phase.

## [ISSUE-004] Admin access control is prototype-only
- Status: open
- Discovered: 2026-06-27
- Description: Admin login accepts hard-coded `admin/admin` credentials in client code and stores authentication as a localStorage boolean. No repository Firestore rules were found during the audit.
- Attempted fixes: none; suitable only for mock data.
- Next step: keep validation data synthetic, then implement Firebase Authentication, role-based authorization, and reviewed Firestore Security Rules before using identifiable patient data.
